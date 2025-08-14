import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { SpectraService } from "./services/spectra";
import { WorldService } from "./services/world";
import { WebSocketService } from "./services/websocket";
import { addMemory, recallMemory } from "../../client/src/utils/memory"; // adjust path if needed

let simulationInterval: NodeJS.Timeout | null = null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Existing API routes
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

  // -----------------------------
  // NEW: /api/chat endpoint
  // -----------------------------
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) return res.status(400).json({ error: "No message provided" });

      // Save user input
      addMemory(`User: ${message}`, "short-term", 5);

      // Retrieve memory context
      const memories = recallMemory(message);

      let reply: string;
      if (memories.length > 0) {
        reply = `Ah, I remember: ${memories[0].content}`;
        addMemory(`Spectra: ${reply}`, "short-term", 6);
      } else {
        // Optionally use SpectraService for dynamic response
        const spectraService = SpectraService.getInstance();
        const dynamicReply = await spectraService.generateReply(message); // make sure this exists
        reply = dynamicReply || "I hear you! Let's explore the Sprawl.";
        addMemory(`Spectra: ${reply}`, "short-term", 6);
      }

      res.json({ reply });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat" });
    }
  });

  // Existing simulation routes
  app.post("/api/simulation/start", async (req, res) => {
    try {
      if (simulationInterval) clearInterval(simulationInterval);

      const spectraService = SpectraService.getInstance();
      const worldService = WorldService.getInstance();
      const wsService = WebSocketService.getInstance();

      simulationInterval = setInterval(async () => {
        try {
          await spectraService.makeAutonomousDecision();
          await worldService.simulationTick();
          wsService.broadcastWorldUpdate();
        } catch (error) {
          console.error("Error in simulation loop:", error);
        }
      }, 30000);

      const worldState = await storage.getWorldState();
      if (worldState) {
        await storage.updateWorldState(worldState.id, { simulationActive: true });
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

      const worldState = await storage.getWorldState();
      if (worldState) {
        await storage.updateWorldState(worldState.id, { simulationActive: false });
      }

      res.json({ success: true, message: "Simulation stopped" });
    } catch (error) {
      res.status(500).json({ error: "Failed to stop simulation" });
    }
  });

  // HTTP + WebSocket server setup
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws/simulation" });
  const wsService = WebSocketService.getInstance();

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");
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
  }, 5000);

  return httpServer;
}