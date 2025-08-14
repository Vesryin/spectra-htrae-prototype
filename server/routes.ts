import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { SpectraService } from "./services/spectra";
import { WorldService } from "./services/world";
import { WebSocketService } from "./services/websocket";

let simulationInterval: NodeJS.Timeout | null = null;

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.get("/api/spectra", async (req, res) => {
    try {
      const spectra = await storage.getSpectra();
      res.json(spectra);
    } catch (error) {
      res.status(500).json({ error: "Failed to get Spectra data" });
    }
  });

  app.get("/api/world", async (req, res) => {
    try {
      const worldService = WorldService.getInstance();
      const worldStatus = await worldService.getWorldStatus();
      res.json(worldStatus);
    } catch (error) {
      res.status(500).json({ error: "Failed to get world data" });
    }
  });

  app.get("/api/messages", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await storage.getMessages(limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.post("/api/simulation/start", async (req, res) => {
    try {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }

      const spectraService = SpectraService.getInstance();
      const worldService = WorldService.getInstance();
      const wsService = WebSocketService.getInstance();

      // Start the simulation loop
      simulationInterval = setInterval(async () => {
        try {
          // Spectra makes autonomous decisions every 30 seconds
          await spectraService.makeAutonomousDecision();
          
          // World simulation tick every 30 seconds
          await worldService.simulationTick();
          
          // Broadcast updates to all connected clients
          wsService.broadcastWorldUpdate();
        } catch (error) {
          console.error("Error in simulation loop:", error);
        }
      }, 30000); // 30 seconds

      // Update world state to active
      const worldState = await storage.getWorldState();
      if (worldState) {
        await storage.updateWorldState(worldState.id, {
          simulationActive: true,
        });
      }

      res.json({ success: true, message: "Simulation started" });
    } catch (error) {
      res.status(500).json({ error: "Failed to start simulation" });
    }
  });

  app.post("/api/simulation/stop", async (req, res) => {
    try {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }

      // Update world state to inactive
      const worldState = await storage.getWorldState();
      if (worldState) {
        await storage.updateWorldState(worldState.id, {
          simulationActive: false,
        });
      }

      res.json({ success: true, message: "Simulation stopped" });
    } catch (error) {
      res.status(500).json({ error: "Failed to stop simulation" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket server with specific path to avoid conflicts with Vite HMR
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws/simulation' 
  });
  const wsService = WebSocketService.getInstance();

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    wsService.addClient(ws);
  });

  // Auto-start simulation
  setTimeout(async () => {
    try {
      const spectraService = SpectraService.getInstance();
      const worldService = WorldService.getInstance();

      simulationInterval = setInterval(async () => {
        try {
          await spectraService.makeAutonomousDecision();
          await worldService.simulationTick();
          wsService.broadcastWorldUpdate();
        } catch (error) {
          console.error("Error in simulation loop:", error);
        }
      }, 30000);

      console.log("Htrae simulation started automatically");
    } catch (error) {
      console.error("Failed to auto-start simulation:", error);
    }
  }, 5000); // Start after 5 seconds

  return httpServer;
}
