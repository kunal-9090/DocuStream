import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Content routes
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/content/featured", async (req, res) => {
    try {
      const content = await storage.getFeaturedContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching featured content:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }
      
      const content = await storage.getContentById(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching content details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/content/genre/:genre", async (req, res) => {
    try {
      const genre = req.params.genre;
      const content = await storage.getContentByGenre(genre);
      res.json(content);
    } catch (error) {
      console.error("Error fetching content by genre:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Series routes
  app.get("/api/series", async (req, res) => {
    try {
      const series = await storage.getAllSeries();
      res.json(series);
    } catch (error) {
      console.error("Error fetching series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/series/featured", async (req, res) => {
    try {
      const series = await storage.getFeaturedSeries();
      res.json(series);
    } catch (error) {
      console.error("Error fetching featured series:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/series/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid series ID" });
      }
      
      const series = await storage.getSeriesById(id);
      if (!series) {
        return res.status(404).json({ message: "Series not found" });
      }
      
      res.json(series);
    } catch (error) {
      console.error("Error fetching series details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/series/:id/episodes", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid series ID" });
      }
      
      const episodes = await storage.getSeriesEpisodes(id);
      res.json(episodes);
    } catch (error) {
      console.error("Error fetching series episodes:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User content routes (requires authentication)
  app.get("/api/user-content", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userContent = await storage.getUserContent(req.user.id);
      res.json(userContent);
    } catch (error) {
      console.error("Error fetching user content:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const updateContentSchema = z.object({
    contentId: z.number().nullable().optional(),
    episodeId: z.number().nullable().optional(),
    watchPercentage: z.number().min(0).max(100).optional(),
    isInList: z.boolean().optional(),
    listType: z.string().nullable().optional()
  });

  app.post("/api/user-content", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const data = updateContentSchema.parse(req.body);
      
      // Ensure at least one ID is provided
      if (!data.contentId && !data.episodeId) {
        return res.status(400).json({ message: "Either contentId or episodeId must be provided" });
      }
      
      // Parse watchPercentage to ensure it's an integer
      const watchPercentage = data.watchPercentage 
        ? Math.round(Number(data.watchPercentage)) 
        : 0;
        
      const userContent = await storage.updateUserContent(
        req.user.id,
        data.contentId || null,
        data.episodeId || null,
        watchPercentage,
        data.isInList,
        data.listType
      );
      
      // Award points if content is completed and watchPercentage is provided
      if (watchPercentage >= 85) {
        let pointsAmount = 0;
        let entityName = "";
        
        // Determine points based on content or episode
        if (data.contentId) {
          const content = await storage.getContentById(data.contentId);
          if (content) {
            pointsAmount = content.points;
            entityName = content.title;
          }
        } else if (data.episodeId) {
          // Get episode details
          // This would require adding a function to storage
          // For now, use a default value
          pointsAmount = 10;
          entityName = "episode";
        }
        
        if (pointsAmount > 0) {
          const refId = data.contentId || data.episodeId || null;
          await storage.addPointsTransaction(
            req.user.id,
            pointsAmount,
            'watching',
            refId,
            `Completed watching ${entityName}`
          );
        }
      }
      
      res.json(userContent);
    } catch (error) {
      console.error("Error updating user content:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Challenges routes
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/user-challenges", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userChallenges = await storage.getUserChallenges(req.user.id);
      res.json(userChallenges);
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const updateChallengeSchema = z.object({
    challengeId: z.number(),
    progressValue: z.number().min(0)
  });

  app.post("/api/user-challenges", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const data = updateChallengeSchema.parse(req.body);
      
      const userChallenge = await storage.updateUserChallenge(
        req.user.id,
        data.challengeId,
        data.progressValue
      );
      
      res.json(userChallenge);
    } catch (error) {
      console.error("Error updating user challenge:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Badges routes
  app.get("/api/user-badges", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const userBadges = await storage.getUserBadges(req.user.id);
      res.json(userBadges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Points routes
  app.get("/api/user-points", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const total = await storage.getUserPointsTotal(req.user.id);
      const today = await storage.getUserRecentPoints(req.user.id, 1);
      const weekly = await storage.getUserRecentPoints(req.user.id, 7);
      const monthly = await storage.getUserRecentPoints(req.user.id, 30);
      
      res.json({
        total,
        today,
        weekly,
        monthly
      });
    } catch (error) {
      console.error("Error fetching user points:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
