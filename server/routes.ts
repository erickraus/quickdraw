import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Minimal routes for static file serving only
  // No API endpoints needed for this client-side application

  const httpServer = createServer(app);

  return httpServer;
}
