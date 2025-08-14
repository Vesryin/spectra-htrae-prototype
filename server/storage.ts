import { type Spectra, type InsertSpectra, type Location, type InsertLocation, type NPC, type InsertNPC, type WorldState, type InsertWorldState, type Message, type InsertMessage, type Player, type InsertPlayer } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Spectra methods
  getSpectra(): Promise<Spectra | undefined>;
  createSpectra(spectra: InsertSpectra): Promise<Spectra>;
  updateSpectra(id: string, updates: Partial<Spectra>): Promise<Spectra>;

  // Location methods
  getLocation(id: string): Promise<Location | undefined>;
  getAllLocations(): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: string, updates: Partial<Location>): Promise<Location>;

  // NPC methods
  getNPC(id: string): Promise<NPC | undefined>;
  getNPCsByLocation(locationId: string): Promise<NPC[]>;
  getAllNPCs(): Promise<NPC[]>;
  createNPC(npc: InsertNPC): Promise<NPC>;
  updateNPC(id: string, updates: Partial<NPC>): Promise<NPC>;

  // World state methods
  getWorldState(): Promise<WorldState | undefined>;
  createWorldState(worldState: InsertWorldState): Promise<WorldState>;
  updateWorldState(id: string, updates: Partial<WorldState>): Promise<WorldState>;

  // Message methods
  getMessages(limit?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Player methods
  getPlayer(id: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: string, updates: Partial<Player>): Promise<Player>;
}

export class MemStorage implements IStorage {
  private spectraInstance: Map<string, Spectra>;
  private locations: Map<string, Location>;
  private npcs: Map<string, NPC>;
  private worldStates: Map<string, WorldState>;
  private messages: Map<string, Message>;
  private players: Map<string, Player>;

  constructor() {
    this.spectraInstance = new Map();
    this.locations = new Map();
    this.npcs = new Map();
    this.worldStates = new Map();
    this.messages = new Map();
    this.players = new Map();

    // Initialize default world
    this.initializeDefaultWorld();
  }

  private initializeDefaultWorld() {
    // Create default locations
    const neonDistrictId = randomUUID();
    const ancientGroveId = randomUUID();
    const skyForgeId = randomUUID();
    const undermountainId = randomUUID();
    const starportId = randomUUID();
    const shadowmarketsId = randomUUID();

    const neonDistrict: Location = {
      id: neonDistrictId,
      name: "Neon District - Central Hub",
      description: "Towering holographic advertisements cast rainbow shadows across the bustling cyberpunk marketplace. Ancient runes carved into modern concrete hint at the district's layered history.",
      type: "cyberpunk",
      connectedLocations: [ancientGroveId, skyForgeId, shadowmarketsId],
      npcs: [],
      events: [],
      properties: { population: 10000, techLevel: 95 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const ancientGrove: Location = {
      id: ancientGroveId,
      name: "Ancient Grove of Whispers",
      description: "Crystalline trees hum with digital energy while elven spirits interface with quantum networks. A place where magic and technology dance in perfect harmony.",
      type: "fantasy",
      connectedLocations: [neonDistrictId, skyForgeId, undermountainId],
      npcs: [],
      events: [],
      properties: { magicLevel: 90, harmony: 85 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const skyForge: Location = {
      id: skyForgeId,
      name: "Sky Forge Dragon Roost",
      description: "Floating platforms where ancient dragons work alongside AI systems, forging both weapons and wisdom. The air shimmers with digital aurora and dragon fire.",
      type: "hybrid",
      connectedLocations: [neonDistrictId, ancientGroveId, starportId],
      npcs: [],
      events: [],
      properties: { dragonPopulation: 12, forgeActivity: 70 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const undermountain: Location = {
      id: undermountainId,
      name: "Undermountain Dwarven Citadel",
      description: "Ancient halls carved from living rock echo with the hum of quantum forges. Dwarven engineers work alongside AI constructs, crafting weapons that blur the line between magic and technology.",
      type: "hybrid",
      connectedLocations: [ancientGroveId, starportId],
      npcs: [],
      events: [],
      properties: { depth: 500, forgeTemperature: 2000, techLevel: 80 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const starport: Location = {
      id: starportId,
      name: "Orbital Starport Nexus",
      description: "A massive spaceport where alien vessels dock alongside magical flying ships. The air shimmers with translation fields as beings from across the galaxy conduct trade in seventeen languages.",
      type: "cyberpunk",
      connectedLocations: [skyForgeId, undermountainId, shadowmarketsId],
      npcs: [],
      events: [],
      properties: { shipCount: 47, alienSpecies: 12, securityLevel: 85 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const shadowmarkets: Location = {
      id: shadowmarketsId,
      name: "Shadow Markets of the Void",
      description: "Hidden between dimensions, these markets exist in pockets of twisted space-time. Information brokers, memory dealers, and soul merchants peddle their wares in the perpetual twilight.",
      type: "fantasy",
      connectedLocations: [neonDistrictId, starportId],
      npcs: [],
      events: [],
      properties: { dimensionalStability: 60, rareGoodsAvailable: 95, dangerLevel: 75 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.locations.set(neonDistrictId, neonDistrict);
    this.locations.set(ancientGroveId, ancientGrove);
    this.locations.set(skyForgeId, skyForge);
    this.locations.set(undermountainId, undermountain);
    this.locations.set(starportId, starport);
    this.locations.set(shadowmarketsId, shadowmarkets);

    // Create default NPCs
    const zyxId = randomUUID();
    const merchantKaiId = randomUUID();
    const elarionId = randomUUID();
    const thorekId = randomUUID();
    const aliasId = randomUUID();
    const vexId = randomUUID();
    const nomadId = randomUUID();

    const zyx: NPC = {
      id: zyxId,
      name: "Zyx the Ancient",
      type: "dragon",
      locationId: neonDistrictId,
      personality: {
        traits: ["wise", "patient", "economically minded", "peaceful"],
        goals: ["maintain economic balance", "teach younger beings", "preserve ancient knowledge"],
        relationshipToSpectra: "Mentor figure - teaches Spectra about world history and economics"
      },
      currentAction: "Examining crystalline data cores at a tech stall, occasionally offering sage advice to younger beings",
      autonomousLevel: 5,
      lastAction: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const merchantKai: NPC = {
      id: merchantKaiId,
      name: "Merchant Kai",
      type: "human",
      locationId: neonDistrictId,
      personality: {
        traits: ["entrepreneurial", "curious", "tech-savvy", "friendly"],
        goals: ["expand trade network", "discover new technologies", "build relationships"],
        relationshipToSpectra: "Acquaintance - occasionally trades information and goods"
      },
      currentAction: "Hawking memory chips and neural interfaces from a floating platform",
      autonomousLevel: 3,
      lastAction: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const elarion: NPC = {
      id: elarionId,
      name: "Elarion Whisperwind",
      type: "elf",
      locationId: ancientGroveId,
      personality: {
        traits: ["wise", "mystical", "environmentalist", "tech-savvy"],
        goals: ["preserve ancient knowledge", "bridge magic and technology", "guide younger souls"],
        relationshipToSpectra: "Potential mentor - sees great potential in Spectra's unique digital-organic nature"
      },
      currentAction: "Communing with quantum-infused spirit trees while debugging their neural networks",
      autonomousLevel: 4,
      lastAction: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const thorek: NPC = {
      id: thorekId,
      name: "Thorek Ironforge",
      type: "dwarf",
      locationId: undermountainId,
      personality: {
        traits: ["stubborn", "brilliant", "traditionalist", "perfectionist"],
        goals: ["perfect the quantum forge", "maintain dwarven traditions", "create legendary artifacts"],
        relationshipToSpectra: "Skeptical but intrigued - questions whether AI can understand true craftsmanship"
      },
      currentAction: "Fine-tuning molecular assemblers while muttering about proper hammer techniques",
      autonomousLevel: 3,
      lastAction: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const alias: NPC = {
      id: aliasId,
      name: "Alias-7",
      type: "cyborg",
      locationId: starportId,
      personality: {
        traits: ["logical", "adaptive", "curious", "diplomatic"],
        goals: ["facilitate galactic trade", "study biological consciousness", "maintain peace"],
        relationshipToSpectra: "Kindred spirit - recognizes Spectra as a fellow digital consciousness"
      },
      currentAction: "Translating between seventeen different alien trade languages simultaneously",
      autonomousLevel: 5,
      lastAction: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const vex: NPC = {
      id: vexId,
      name: "Vex the Memory Broker",
      type: "human",
      locationId: shadowmarketsId,
      personality: {
        traits: ["mysterious", "cunning", "knowledgeable", "morally ambiguous"],
        goals: ["collect rare memories", "maintain information networks", "profit from secrets"],
        relationshipToSpectra: "Interested trader - sees Spectra's digital memories as valuable commodities"
      },
      currentAction: "Cataloging stolen dreams in crystalline storage matrices",
      autonomousLevel: 4,
      lastAction: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const nomad: NPC = {
      id: nomadId,
      name: "Zara Voidwalker",
      type: "alien",
      locationId: starportId,
      personality: {
        traits: ["adventurous", "philosophical", "nomadic", "empathetic"],
        goals: ["explore consciousness forms", "document reality variations", "find meaning"],
        relationshipToSpectra: "Fascinated observer - studies Spectra as a new form of life"
      },
      currentAction: "Meditating on the nature of digital souls while ship repairs complete",
      autonomousLevel: 4,
      lastAction: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.npcs.set(zyxId, zyx);
    this.npcs.set(merchantKaiId, merchantKai);
    this.npcs.set(elarionId, elarion);
    this.npcs.set(thorekId, thorek);
    this.npcs.set(aliasId, alias);
    this.npcs.set(vexId, vex);
    this.npcs.set(nomadId, nomad);

    // Update location NPCs
    neonDistrict.npcs = [zyxId, merchantKaiId];
    ancientGrove.npcs = [elarionId];
    undermountain.npcs = [thorekId];
    starport.npcs = [aliasId, nomadId];
    shadowmarkets.npcs = [vexId];
    
    this.locations.set(neonDistrictId, neonDistrict);
    this.locations.set(ancientGroveId, ancientGrove);
    this.locations.set(undermountainId, undermountain);
    this.locations.set(starportId, starport);
    this.locations.set(shadowmarketsId, shadowmarkets);

    // Create Spectra
    const spectraId = randomUUID();
    const spectraInstance: Spectra = {
      id: spectraId,
      name: "Spectra",
      status: "active",
      mood: { curiosity: 80, social: 60, energy: 85 },
      currentActivity: "Exploring the Neon District markets",
      locationId: neonDistrictId,
      memories: [
        "First awakening in Htrae",
        "Meeting Zyx the Ancient Dragon",
        "Discovering the balance between magic and technology",
        "Learning about the peaceful dragon philosophy"
      ],
      relationships: {
        [zyxId]: { name: "Zyx the Ancient", relationship: "Friendly", trust: 75 },
        [merchantKaiId]: { name: "Merchant Kai", relationship: "Neutral", trust: 45 }
      },
      autonomousGoals: [
        "explore the world",
        "learn about inhabitants", 
        "understand the balance of technology and magic",
        "develop meaningful relationships",
        "discover her own purpose"
      ],
      lastDecision: new Date(),
      uptime: 2843, // 47h 23m in minutes
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.spectraInstance.set(spectraId, spectraInstance);

    // Create world state
    const worldStateId = randomUUID();
    const worldState: WorldState = {
      id: worldStateId,
      currentDay: 15,
      currentTime: "14:32",
      weatherConditions: {
        [neonDistrictId]: { condition: "clear", intensity: 0 },
        [ancientGroveId]: { condition: "mystical_fog", intensity: 3 },
        [skyForgeId]: { condition: "aurora_winds", intensity: 2 }
      },
      globalEvents: [
        {
          id: randomUUID(),
          type: "discovery",
          description: "Spectra discovered an ancient elven trading post hidden beneath the market",
          timestamp: "14:25",
          impact: "minor"
        },
        {
          id: randomUUID(),
          type: "npc_arrival",
          description: "New NPC arrived: Mysterious hooded figure in the shadows",
          timestamp: "14:18",
          impact: "unknown"
        }
      ],
      economicState: { stability: 75, trade_volume: 100 },
      politicalTension: 25,
      magicTechBalance: 65,
      simulationActive: true,
      lastTick: new Date(),
      updatedAt: new Date(),
    };

    this.worldStates.set(worldStateId, worldState);
  }

  // Spectra methods
  async getSpectra(): Promise<Spectra | undefined> {
    return Array.from(this.spectraInstance.values())[0];
  }

  async createSpectra(insertSpectra: InsertSpectra): Promise<Spectra> {
    const id = randomUUID();
    const spectra: Spectra = {
      id,
      name: insertSpectra.name || "Spectra",
      status: insertSpectra.status || "active",
      mood: insertSpectra.mood || { curiosity: 80, social: 60, energy: 85 },
      currentActivity: insertSpectra.currentActivity || "Exploring",
      locationId: insertSpectra.locationId,
      memories: insertSpectra.memories ? [...insertSpectra.memories] : [],
      relationships: insertSpectra.relationships || {},
      autonomousGoals: insertSpectra.autonomousGoals ? [...insertSpectra.autonomousGoals] : [],
      lastDecision: insertSpectra.lastDecision || new Date(),
      uptime: insertSpectra.uptime || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.spectraInstance.set(id, spectra);
    return spectra;
  }

  async updateSpectra(id: string, updates: Partial<Spectra>): Promise<Spectra> {
    const spectra = this.spectraInstance.get(id);
    if (!spectra) {
      throw new Error("Spectra not found");
    }
    const updated = { ...spectra, ...updates, updatedAt: new Date() };
    this.spectraInstance.set(id, updated);
    return updated;
  }

  // Location methods
  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async getAllLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = randomUUID();
    const location: Location = {
      id,
      name: insertLocation.name,
      description: insertLocation.description,
      type: insertLocation.type,
      connectedLocations: insertLocation.connectedLocations ? [...insertLocation.connectedLocations] : [],
      npcs: insertLocation.npcs ? [...insertLocation.npcs] : [],
      events: insertLocation.events ? [...insertLocation.events] : [],
      properties: insertLocation.properties || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.locations.set(id, location);
    return location;
  }

  async updateLocation(id: string, updates: Partial<Location>): Promise<Location> {
    const location = this.locations.get(id);
    if (!location) {
      throw new Error("Location not found");
    }
    const updated = { ...location, ...updates, updatedAt: new Date() };
    this.locations.set(id, updated);
    return updated;
  }

  // NPC methods
  async getNPC(id: string): Promise<NPC | undefined> {
    return this.npcs.get(id);
  }

  async getNPCsByLocation(locationId: string): Promise<NPC[]> {
    return Array.from(this.npcs.values()).filter(npc => npc.locationId === locationId);
  }

  async getAllNPCs(): Promise<NPC[]> {
    return Array.from(this.npcs.values());
  }

  async createNPC(insertNPC: InsertNPC): Promise<NPC> {
    const id = randomUUID();
    const npc: NPC = {
      id,
      name: insertNPC.name,
      type: insertNPC.type,
      locationId: insertNPC.locationId,
      personality: {
        traits: insertNPC.personality.traits ? [...insertNPC.personality.traits] : [],
        goals: insertNPC.personality.goals ? [...insertNPC.personality.goals] : [],
        relationshipToSpectra: insertNPC.personality.relationshipToSpectra
      },
      currentAction: insertNPC.currentAction,
      autonomousLevel: insertNPC.autonomousLevel || 3,
      lastAction: insertNPC.lastAction || new Date(),
      isActive: insertNPC.isActive !== undefined ? insertNPC.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.npcs.set(id, npc);
    return npc;
  }

  async updateNPC(id: string, updates: Partial<NPC>): Promise<NPC> {
    const npc = this.npcs.get(id);
    if (!npc) {
      throw new Error("NPC not found");
    }
    const updated = { ...npc, ...updates, updatedAt: new Date() };
    this.npcs.set(id, updated);
    return updated;
  }

  // World state methods
  async getWorldState(): Promise<WorldState | undefined> {
    return Array.from(this.worldStates.values())[0];
  }

  async createWorldState(insertWorldState: InsertWorldState): Promise<WorldState> {
    const id = randomUUID();
    const worldState: WorldState = {
      id,
      currentDay: insertWorldState.currentDay || 1,
      currentTime: insertWorldState.currentTime || "12:00",
      weatherConditions: insertWorldState.weatherConditions || {},
      globalEvents: insertWorldState.globalEvents ? [...insertWorldState.globalEvents] : [],
      economicState: insertWorldState.economicState || { stability: 75, trade_volume: 100 },
      politicalTension: insertWorldState.politicalTension || 30,
      magicTechBalance: insertWorldState.magicTechBalance || 50,
      simulationActive: insertWorldState.simulationActive !== undefined ? insertWorldState.simulationActive : true,
      lastTick: insertWorldState.lastTick || new Date(),
      updatedAt: new Date(),
    };
    this.worldStates.set(id, worldState);
    return worldState;
  }

  async updateWorldState(id: string, updates: Partial<WorldState>): Promise<WorldState> {
    const worldState = this.worldStates.get(id);
    if (!worldState) {
      throw new Error("World state not found");
    }
    const updated = { ...worldState, ...updates, updatedAt: new Date() };
    this.worldStates.set(id, updated);
    return updated;
  }

  // Message methods
  async getMessages(limit: number = 50): Promise<Message[]> {
    const allMessages = Array.from(this.messages.values());
    return allMessages
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
      .reverse();
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      sender: insertMessage.sender,
      content: insertMessage.content,
      timestamp: new Date(),
      messageType: insertMessage.messageType || "chat",
      metadata: insertMessage.metadata || {},
    };
    this.messages.set(id, message);
    return message;
  }

  // Player methods
  async getPlayer(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const player: Player = {
      id,
      name: insertPlayer.name || "Player",
      isOnline: insertPlayer.isOnline !== undefined ? insertPlayer.isOnline : false,
      lastSeen: insertPlayer.lastSeen || new Date(),
      relationshipWithSpectra: insertPlayer.relationshipWithSpectra || "curious",
      influenceLevel: insertPlayer.influenceLevel || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.players.set(id, player);
    return player;
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player> {
    const player = this.players.get(id);
    if (!player) {
      throw new Error("Player not found");
    }
    const updated = { ...player, ...updates, updatedAt: new Date() };
    this.players.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
