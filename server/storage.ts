import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, desc, gt, lt, isNull, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "@db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUserByUsername(username: string): Promise<schema.User | undefined>;
  getUser(id: number): Promise<schema.User | undefined>;
  createUser(userData: schema.InsertUser): Promise<schema.User>;
  
  getAllContent(): Promise<schema.Content[]>;
  getFeaturedContent(): Promise<schema.Content[]>;
  getContentById(id: number): Promise<schema.Content | undefined>;
  getContentByGenre(genre: string): Promise<schema.Content[]>;
  
  getAllSeries(): Promise<schema.Series[]>;
  getFeaturedSeries(): Promise<schema.Series[]>;
  getSeriesById(id: number): Promise<schema.Series | undefined>;
  getSeriesEpisodes(seriesId: number): Promise<schema.Episode[]>;
  
  getUserContent(userId: number): Promise<any[]>; // With content details
  updateUserContent(
    userId: number, 
    contentId: number | null, 
    episodeId: number | null, 
    watchPercentage: number,
    isInList?: boolean,
    listType?: string | null
  ): Promise<schema.UserContent>;
  
  getChallenges(): Promise<schema.Challenge[]>;
  getUserChallenges(userId: number): Promise<any[]>; // With challenge details
  updateUserChallenge(userId: number, challengeId: number, progressValue: number): Promise<schema.UserChallenge>;
  
  getUserBadges(userId: number): Promise<any[]>; // With badge details
  awardBadge(userId: number, badgeId: number): Promise<schema.UserBadge>;
  
  addPointsTransaction(userId: number, pointsAmount: number, transactionType: string, referenceId: number | null, description: string): Promise<schema.PointsTransaction>;
  getUserPointsTotal(userId: number): Promise<number>;
  getUserRecentPoints(userId: number, days: number): Promise<number>;
  
  sessionStore: any; // Store from express-session
}

class DatabaseStorage implements IStorage {
  sessionStore: any; // Store from express-session

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'user_sessions'
    });
  }

  async getUserByUsername(username: string): Promise<schema.User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
    return users[0];
  }

  async getUser(id: number): Promise<schema.User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return users[0];
  }

  async createUser(userData: schema.InsertUser): Promise<schema.User> {
    const [user] = await db.insert(schema.users).values(userData).returning();
    return user;
  }

  async getAllContent(): Promise<schema.Content[]> {
    return await db.select().from(schema.content).orderBy(desc(schema.content.addedDate));
  }

  async getFeaturedContent(): Promise<schema.Content[]> {
    return await db.select().from(schema.content).where(eq(schema.content.isFeatured, true)).orderBy(desc(schema.content.addedDate));
  }

  async getContentById(id: number): Promise<schema.Content | undefined> {
    const content = await db.select().from(schema.content).where(eq(schema.content.id, id)).limit(1);
    return content[0];
  }

  async getContentByGenre(genre: string): Promise<schema.Content[]> {
    // Find content where the genre array includes the specified genre
    return await db.select().from(schema.content)
      .where(sql`${genre} = ANY(${schema.content.genres})`)
      .orderBy(desc(schema.content.addedDate));
  }

  async getAllSeries(): Promise<schema.Series[]> {
    return await db.select().from(schema.series).orderBy(desc(schema.series.releaseYearStart));
  }

  async getFeaturedSeries(): Promise<schema.Series[]> {
    return await db.select().from(schema.series).where(eq(schema.series.isFeatured, true)).orderBy(desc(schema.series.releaseYearStart));
  }

  async getSeriesById(id: number): Promise<schema.Series | undefined> {
    const series = await db.select().from(schema.series).where(eq(schema.series.id, id)).limit(1);
    return series[0];
  }

  async getSeriesEpisodes(seriesId: number): Promise<schema.Episode[]> {
    return await db.select().from(schema.episodes)
      .where(eq(schema.episodes.seriesId, seriesId))
      .orderBy(schema.episodes.seasonNumber, schema.episodes.episodeNumber);
  }

  async getUserContent(userId: number): Promise<any[]> {
    // Get user content with content details
    const userContent = await db.select({
      id: schema.userContent.id,
      watchPercentage: schema.userContent.watchPercentage,
      lastWatchDate: schema.userContent.lastWatchDate,
      isCompleted: schema.userContent.isCompleted,
      userRating: schema.userContent.userRating,
      isInList: schema.userContent.isInList,
      listType: schema.userContent.listType,
      content: {
        id: schema.content.id,
        title: schema.content.title,
        thumbnailUrl: schema.content.thumbnailUrl,
        duration: schema.content.duration,
        type: schema.content.type,
        points: schema.content.points
      },
      episode: {
        id: schema.episodes.id,
        title: schema.episodes.title,
        seasonNumber: schema.episodes.seasonNumber,
        episodeNumber: schema.episodes.episodeNumber,
        duration: schema.episodes.duration,
        points: schema.episodes.points
      }
    })
    .from(schema.userContent)
    .leftJoin(schema.content, eq(schema.userContent.contentId, schema.content.id))
    .leftJoin(schema.episodes, eq(schema.userContent.episodeId, schema.episodes.id))
    .where(eq(schema.userContent.userId, userId))
    .orderBy(desc(schema.userContent.lastWatchDate));
    
    return userContent;
  }

  async updateUserContent(
    userId: number, 
    contentId: number | null, 
    episodeId: number | null, 
    watchPercentage: number = 0,
    isInList?: boolean,
    listType?: string | null
  ): Promise<schema.UserContent> {
    const isCompleted = watchPercentage >= 85;
    
    // Check if entry already exists
    const existingEntries = await db.select()
      .from(schema.userContent)
      .where(
        and(
          eq(schema.userContent.userId, userId),
          contentId ? eq(schema.userContent.contentId, contentId) : isNull(schema.userContent.contentId),
          episodeId ? eq(schema.userContent.episodeId, episodeId) : isNull(schema.userContent.episodeId)
        )
      )
      .limit(1);
    
    if (existingEntries.length > 0) {
      // Update existing entry
      const updateData: any = {}; 
      
      // Only update fields that were provided
      if (typeof watchPercentage === 'number') {
        updateData.watchPercentage = watchPercentage;
        updateData.lastWatchDate = new Date();
        updateData.isCompleted = isCompleted || existingEntries[0].isCompleted; // Once completed, stay completed
      }
      
      if (typeof isInList === 'boolean') {
        updateData.isInList = isInList;
        
        // Only update listType if isInList is true and listType is provided
        if (isInList && listType) {
          updateData.listType = listType;
        } else if (!isInList) {
          updateData.listType = null;
        }
      }
      
      const [updated] = await db.update(schema.userContent)
        .set(updateData)
        .where(eq(schema.userContent.id, existingEntries[0].id))
        .returning();
      
      return updated;
    } else {
      // Create new entry
      const [created] = await db.insert(schema.userContent)
        .values({
          userId,
          contentId,
          episodeId,
          watchPercentage,
          lastWatchDate: new Date(),
          isCompleted,
          isInList: typeof isInList === 'boolean' ? isInList : false,
          listType: isInList && listType ? listType : null
        })
        .returning();
      
      return created;
    }
  }

  async getChallenges(): Promise<schema.Challenge[]> {
    return await db.select().from(schema.challenges).where(gt(schema.challenges.endDate, new Date()));
  }

  async getUserChallenges(userId: number): Promise<any[]> {
    const userChallenges = await db.select({
      id: schema.userChallenges.id,
      progressValue: schema.userChallenges.progressValue,
      startDate: schema.userChallenges.startDate,
      completionDate: schema.userChallenges.completionDate,
      status: schema.userChallenges.status,
      challenge: {
        id: schema.challenges.id,
        title: schema.challenges.title,
        description: schema.challenges.description,
        imageUrl: schema.challenges.imageUrl,
        endDate: schema.challenges.endDate,
        requirementType: schema.challenges.requirementType,
        requirementValue: schema.challenges.requirementValue,
        requirementGenre: schema.challenges.requirementGenre,
        pointReward: schema.challenges.pointReward,
        difficulty: schema.challenges.difficulty
      }
    })
    .from(schema.userChallenges)
    .innerJoin(schema.challenges, eq(schema.userChallenges.challengeId, schema.challenges.id))
    .where(eq(schema.userChallenges.userId, userId))
    .orderBy(desc(schema.userChallenges.startDate));
    
    return userChallenges;
  }

  async updateUserChallenge(userId: number, challengeId: number, progressValue: number): Promise<schema.UserChallenge> {
    // Get the challenge to check requirements
    const challenge = await db.select().from(schema.challenges).where(eq(schema.challenges.id, challengeId)).limit(1);
    
    if (!challenge.length) {
      throw new Error("Challenge not found");
    }
    
    const isCompleted = progressValue >= challenge[0].requirementValue;
    const status = isCompleted ? "completed" : "active";
    
    // Check if entry already exists
    const existingEntries = await db.select()
      .from(schema.userChallenges)
      .where(
        and(
          eq(schema.userChallenges.userId, userId),
          eq(schema.userChallenges.challengeId, challengeId)
        )
      )
      .limit(1);
    
    if (existingEntries.length > 0) {
      // Don't update if already completed
      if (existingEntries[0].status === "completed") {
        return existingEntries[0];
      }
      
      // Update existing entry
      const [updated] = await db.update(schema.userChallenges)
        .set({ 
          progressValue, 
          status,
          completionDate: isCompleted ? new Date() : null
        })
        .where(eq(schema.userChallenges.id, existingEntries[0].id))
        .returning();
      
      return updated;
    } else {
      // Create new entry
      const [created] = await db.insert(schema.userChallenges)
        .values({
          userId,
          challengeId,
          progressValue,
          startDate: new Date(),
          completionDate: isCompleted ? new Date() : null,
          status
        })
        .returning();
      
      return created;
    }
  }

  async getUserBadges(userId: number): Promise<any[]> {
    const userBadges = await db.select({
      id: schema.userBadges.id,
      dateEarned: schema.userBadges.dateEarned,
      isDisplayed: schema.userBadges.isDisplayed,
      badge: {
        id: schema.badges.id,
        name: schema.badges.name,
        description: schema.badges.description,
        imageUrl: schema.badges.imageUrl,
        category: schema.badges.category,
        tier: schema.badges.tier,
        pointValue: schema.badges.pointValue,
        rarity: schema.badges.rarity
      }
    })
    .from(schema.userBadges)
    .innerJoin(schema.badges, eq(schema.userBadges.badgeId, schema.badges.id))
    .where(eq(schema.userBadges.userId, userId))
    .orderBy(desc(schema.userBadges.dateEarned));
    
    return userBadges;
  }

  async awardBadge(userId: number, badgeId: number): Promise<schema.UserBadge> {
    // Check if user already has this badge
    const existingBadges = await db.select()
      .from(schema.userBadges)
      .where(
        and(
          eq(schema.userBadges.userId, userId),
          eq(schema.userBadges.badgeId, badgeId)
        )
      )
      .limit(1);
    
    if (existingBadges.length > 0) {
      return existingBadges[0];
    }
    
    // Award the badge
    const [userBadge] = await db.insert(schema.userBadges)
      .values({
        userId,
        badgeId,
        dateEarned: new Date(),
        isDisplayed: false
      })
      .returning();
    
    // Get badge details for points
    const badge = await db.select().from(schema.badges).where(eq(schema.badges.id, badgeId)).limit(1);
    
    // Add points if badge has point value
    if (badge.length && badge[0].pointValue > 0) {
      await this.addPointsTransaction(
        userId,
        badge[0].pointValue,
        'badge',
        badgeId,
        `Earned the ${badge[0].name} badge`
      );
    }
    
    return userBadge;
  }

  async addPointsTransaction(userId: number, pointsAmount: number, transactionType: string, referenceId: number | null, description: string): Promise<schema.PointsTransaction> {
    // Get current points balance
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const currentBalance = user.points + pointsAmount;
    
    // Create transaction
    const [transaction] = await db.insert(schema.pointsTransactions)
      .values({
        userId,
        transactionDate: new Date(),
        pointsAmount,
        transactionType,
        referenceId,
        description,
        currentBalance
      })
      .returning();
    
    // Update user points
    await db.update(schema.users)
      .set({ points: currentBalance })
      .where(eq(schema.users.id, userId));
    
    return transaction;
  }

  async getUserPointsTotal(userId: number): Promise<number> {
    const user = await this.getUser(userId);
    return user ? user.points : 0;
  }

  async getUserRecentPoints(userId: number, days: number): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - days);
    
    const result = await db.select({
      total: sql<number>`SUM(${schema.pointsTransactions.pointsAmount})`
    })
    .from(schema.pointsTransactions)
    .where(
      and(
        eq(schema.pointsTransactions.userId, userId),
        gt(schema.pointsTransactions.transactionDate, date)
      )
    );
    
    return result[0]?.total || 0;
  }
}

export const storage = new DatabaseStorage();
