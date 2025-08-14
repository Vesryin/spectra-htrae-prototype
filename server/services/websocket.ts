import { WebSocket } from "ws";
import { storage } from "../storage";
import { SpectraService } from "./spectra";

export interface WebSocketClient {
  id: string;
  ws: WebSocket;
  playerId?: string;
}

export class WebSocketService {
  private static instance: WebSocketService;
  private clients: Map<string, WebSocketClient> = new Map();
  
  private constructor() {}
  
  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  addClient(ws: WebSocket): string {
    const clientId = crypto.randomUUID();
    const client: WebSocketClient = { id: clientId, ws };
    
    this.clients.set(clientId, client);
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        await this.handleMessage(clientId, message);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        this.sendToClient(clientId, {
          type: 'error',
          data: { message: 'Invalid message format' }
        });
      }
    });

    ws.on('close', () => {
      this.removeClient(clientId);
    });

    // Send initial world state
    this.sendWorldUpdate(clientId);
    
    return clientId;
  }

  removeClient(clientId: string): void {
    this.clients.delete(clientId);
  }

  private async handleMessage(clientId: string, message: any): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'chat_message':
        await this.handleChatMessage(clientId, message.data);
        break;
      case 'player_join':
        await this.handlePlayerJoin(clientId, message.data);
        break;
      case 'request_world_update':
        await this.sendWorldUpdate(clientId);
        break;
      default:
        console.warn(`Unknown message type: ${message.type}`);
    }
  }

  private async handleChatMessage(clientId: string, data: { content: string }): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client || !client.playerId) return;

    // Store the player message
    await storage.createMessage({
      sender: "player",
      content: data.content,
      messageType: "chat",
      metadata: { playerId: client.playerId || "" }
    });

    // Let Spectra process and respond to the message
    const spectraService = SpectraService.getInstance();
    await spectraService.processPlayerMessage(data.content, client.playerId);

    // Broadcast the new messages to all clients
    this.broadcastMessages();
  }

  private async handlePlayerJoin(clientId: string, data: { name?: string }): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Create or update player
    const player = await storage.createPlayer({
      name: data.name || "Player",
      isOnline: true,
      lastSeen: new Date(),
      relationshipWithSpectra: "curious",
      influenceLevel: 1,
    });

    client.playerId = player.id;
    this.clients.set(clientId, client);

    // Send welcome message
    await storage.createMessage({
      sender: "system",
      content: `${player.name} has joined the simulation`,
      messageType: "system",
      metadata: { playerId: player.id }
    });

    this.broadcastMessages();
    this.sendWorldUpdate(clientId);
  }

  private async sendWorldUpdate(clientId: string): Promise<void> {
    try {
      const [spectra, worldState, locations, messages] = await Promise.all([
        storage.getSpectra(),
        storage.getWorldState(),
        storage.getAllLocations(),
        storage.getMessages(50)
      ]);

      if (!spectra || !worldState) return;

      const currentLocation = await storage.getLocation(spectra.locationId);
      const npcsInLocation = currentLocation ? await storage.getNPCsByLocation(currentLocation.id) : [];

      this.sendToClient(clientId, {
        type: 'world_update',
        data: {
          spectra,
          worldState,
          currentLocation,
          npcsInLocation,
          locations,
          messages
        }
      });
    } catch (error) {
      console.error('Error sending world update:', error);
    }
  }

  private async broadcastMessages(): Promise<void> {
    const messages = await storage.getMessages(50);
    this.broadcast({
      type: 'messages_update',
      data: { messages }
    });
  }

  broadcast(message: any): void {
    this.clients.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  broadcastWorldUpdate(): void {
    this.clients.forEach(client => {
      this.sendWorldUpdate(client.id);
    });
  }

  private sendToClient(clientId: string, message: any): void {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }
}
