import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  profileImageUrl: text("profile_image_url"),
  joinDate: timestamp("join_date").defaultNow().notNull(),
  lastLoginDate: timestamp("last_login_date"),
  accountStatus: text("account_status").default("active").notNull(),
  points: integer("points").default(0).notNull(),
  watchCount: integer("watch_count").default(0).notNull(),
  watchMinutes: integer("watch_minutes").default(0).notNull()
});

// Content Table
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  bannerImageUrl: text("banner_image_url"),
  videoUrl: text("video_url").notNull(),
  trailerUrl: text("trailer_url"),
  duration: integer("duration").notNull(), // in minutes
  type: text("type").notNull(), // Movie/Series/Documentary
  releaseYear: integer("release_year").notNull(),
  genres: text("genres").array().notNull(),
  director: text("director"),
  cast: text("cast").array(),
  ageRating: text("age_rating"),
  contentRating: doublePrecision("content_rating"),
  viewCount: integer("view_count").default(0).notNull(),
  addedDate: timestamp("added_date").defaultNow().notNull(),
  language: text("language").default("English").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  points: integer("points").default(10).notNull(),
  hasChallenge: boolean("has_challenge").default(false).notNull(),
  hasQuiz: boolean("has_quiz").default(false).notNull()
});

// Series Table
export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  bannerImageUrl: text("banner_image_url"),
  seasons: integer("seasons").notNull(),
  totalEpisodes: integer("total_episodes").notNull(),
  releaseYearStart: integer("release_year_start").notNull(),
  releaseYearEnd: integer("release_year_end"),
  genres: text("genres").array().notNull(),
  creator: text("creator"),
  ageRating: text("age_rating"),
  language: text("language").default("English").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull()
});

// Episodes Table
export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id").notNull().references(() => series.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  seasonNumber: integer("season_number").notNull(),
  episodeNumber: integer("episode_number").notNull(),
  duration: integer("duration").notNull(), // in minutes
  thumbnailUrl: text("thumbnail_url").notNull(),
  videoUrl: text("video_url").notNull(),
  releaseDate: timestamp("release_date").notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  points: integer("points").default(10).notNull()
});

// UserContent Table
export const userContent = pgTable("user_content", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  contentId: integer("content_id").references(() => content.id),
  episodeId: integer("episode_id").references(() => episodes.id),
  watchPercentage: integer("watch_percentage").default(0).notNull(),
  lastWatchDate: timestamp("last_watch_date").defaultNow().notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  userRating: integer("user_rating"),
  isInList: boolean("is_in_list").default(false),
  listType: text("list_type")
});

// Challenges Table
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  requirementType: text("requirement_type").notNull(), // Watch, Quiz, etc.
  requirementValue: integer("requirement_value").notNull(),
  requirementGenre: text("requirement_genre"),
  pointReward: integer("point_reward").notNull(),
  difficulty: text("difficulty").notNull(), // Easy, Medium, Hard
  isRecurring: boolean("is_recurring").default(false).notNull()
});

// UserChallenges Table
export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  progressValue: integer("progress_value").default(0).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  completionDate: timestamp("completion_date"),
  status: text("status").default("active").notNull() // Active, Completed, Failed
});

// Badges Table
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // Watching, Social, Explorer
  tier: text("tier").notNull(), // Bronze, Silver, Gold, Platinum
  requirementType: text("requirement_type").notNull(),
  requirementValue: integer("requirement_value").notNull(),
  requirementGenre: text("requirement_genre"),
  pointValue: integer("point_value").default(0).notNull(),
  rarity: text("rarity").notNull() // Common, Uncommon, Rare, Epic, Legendary
});

// UserBadges Table
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  badgeId: integer("badge_id").notNull().references(() => badges.id),
  dateEarned: timestamp("date_earned").defaultNow().notNull(),
  isDisplayed: boolean("is_displayed").default(false).notNull()
});

// Points Transaction Table
export const pointsTransactions = pgTable("points_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
  pointsAmount: integer("points_amount").notNull(),
  transactionType: text("transaction_type").notNull(), // Watching, Challenge, Quiz, etc.
  referenceId: integer("reference_id"), // ID of related content, challenge, etc.
  description: text("description").notNull(),
  currentBalance: integer("current_balance").notNull()
});

// Relations

export const usersRelations = relations(users, ({ many }) => ({
  userContent: many(userContent),
  userChallenges: many(userChallenges),
  userBadges: many(userBadges),
  pointsTransactions: many(pointsTransactions)
}));

export const contentRelations = relations(content, ({ many }) => ({
  userContent: many(userContent)
}));

export const seriesRelations = relations(series, ({ many }) => ({
  episodes: many(episodes)
}));

export const episodesRelations = relations(episodes, ({ one, many }) => ({
  series: one(series, {
    fields: [episodes.seriesId],
    references: [series.id]
  }),
  userContent: many(userContent)
}));

export const userContentRelations = relations(userContent, ({ one }) => ({
  user: one(users, {
    fields: [userContent.userId],
    references: [users.id]
  }),
  content: one(content, {
    fields: [userContent.contentId],
    references: [content.id]
  }),
  episode: one(episodes, {
    fields: [userContent.episodeId],
    references: [episodes.id]
  })
}));

export const challengesRelations = relations(challenges, ({ many }) => ({
  userChallenges: many(userChallenges)
}));

export const userChallengesRelations = relations(userChallenges, ({ one }) => ({
  user: one(users, {
    fields: [userChallenges.userId],
    references: [users.id]
  }),
  challenge: one(challenges, {
    fields: [userChallenges.challengeId],
    references: [challenges.id]
  })
}));

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges)
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id]
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id]
  })
}));

export const pointsTransactionsRelations = relations(pointsTransactions, ({ one }) => ({
  user: one(users, {
    fields: [pointsTransactions.userId],
    references: [users.id]
  })
}));

// Schemas for validation

export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Username must be at least 3 characters"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
  displayName: (schema) => schema.min(2, "Display name must be at least 2 characters"),
  email: (schema) => schema.email("Please provide a valid email address")
}).omit({ joinDate: true, lastLoginDate: true, accountStatus: true, points: true, watchCount: true, watchMinutes: true });

export const insertContentSchema = createInsertSchema(content);
export const insertSeriesSchema = createInsertSchema(series);
export const insertEpisodeSchema = createInsertSchema(episodes);
export const insertUserContentSchema = createInsertSchema(userContent);
export const insertChallengeSchema = createInsertSchema(challenges);
export const insertUserChallengeSchema = createInsertSchema(userChallenges);
export const insertBadgeSchema = createInsertSchema(badges);
export const insertUserBadgeSchema = createInsertSchema(userBadges);
export const insertPointsTransactionSchema = createInsertSchema(pointsTransactions);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Content = typeof content.$inferSelect;
export type Series = typeof series.$inferSelect;
export type Episode = typeof episodes.$inferSelect;
export type UserContent = typeof userContent.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type PointsTransaction = typeof pointsTransactions.$inferSelect;

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

export type LoginCredentials = z.infer<typeof loginSchema>;
