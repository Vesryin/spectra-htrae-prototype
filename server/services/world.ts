import { storage } from "../storage";
import { type WorldState, type NPC, type Location } from "@shared/schema";

export class WorldService {
  private static instance: WorldService;
  
  private constructor() {}
  
  static getInstance(): WorldService {
    if (!WorldService.instance) {
      WorldService.instance = new WorldService();
    }
    return WorldService.instance;
  }

  async simulationTick(): Promise<void> {
    console.log("World simulation tick started");
    
    try {
      await Promise.all([
        this.updateWorldTime(),
        this.updateWeather(),
        this.updateNPCs(),
        this.updateWorldState(),
      ]);
      
      console.log("World simulation tick completed");
    } catch (error) {
      console.error("Error in world simulation tick:", error);
    }
  }

  private async updateWorldTime(): Promise<void> {
    const worldState = await storage.getWorldState();
    if (!worldState) return;

    // Advance time by 1 minute per tick
    const [hours, minutes] = worldState.currentTime.split(":").map(Number);
    let newHours = hours;
    let newMinutes = minutes + 1;
    let newDay = worldState.currentDay;

    if (newMinutes >= 60) {
      newMinutes = 0;
      newHours += 1;
    }

    if (newHours >= 24) {
      newHours = 0;
      newDay += 1;
    }

    const newTime = `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;

    await storage.updateWorldState(worldState.id, {
      currentTime: newTime,
      currentDay: newDay,
      lastTick: new Date(),
    });
  }

  private async updateWeather(): Promise<void> {
    const worldState = await storage.getWorldState();
    if (!worldState) return;

    // Randomly change weather conditions
    if (Math.random() < 0.1) { // 10% chance per tick
      const locations = await storage.getAllLocations();
      const newWeatherConditions = { ...worldState.weatherConditions };

      for (const location of locations) {
        if (Math.random() < 0.3) { // 30% chance for each location
          const conditions = this.getWeatherConditionsForLocationType(location.type);
          const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
          
          newWeatherConditions[location.id] = {
            condition: randomCondition,
            intensity: Math.floor(Math.random() * 5) + 1,
          };
        }
      }

      await storage.updateWorldState(worldState.id, {
        weatherConditions: newWeatherConditions,
      });
    }
  }

  private getWeatherConditionsForLocationType(type: string): string[] {
    switch (type) {
      case "cyberpunk":
        return ["clear", "neon_rain", "smog", "digital_storm", "holo_fog"];
      case "fantasy":
        return ["clear", "mystical_fog", "fairy_dust", "aurora_lights", "magical_storm"];
      case "hybrid":
        return ["clear", "aurora_winds", "techno_mist", "quantum_rain", "harmonic_storm"];
      case "industrial":
        return ["clear", "acid_rain", "industrial_smog", "steam_clouds", "toxic_winds"];
      default:
        return ["clear", "cloudy", "rain", "storm"];
    }
  }

  private async updateNPCs(): Promise<void> {
    const npcs = await storage.getAllNPCs();
    
    for (const npc of npcs) {
      if (!npc.isActive) continue;
      
      // Each NPC has a chance to perform an action based on their autonomy level
      const actionChance = npc.autonomousLevel * 0.1; // 10-50% chance based on autonomy
      
      if (Math.random() < actionChance) {
        await this.performNPCAction(npc);
      }
    }
  }

  private async performNPCAction(npc: NPC): Promise<void> {
    const location = await storage.getLocation(npc.locationId);
    if (!location) return;

    const actions = this.getActionsForNPCType(npc.type, npc.personality);
    const newAction = actions[Math.floor(Math.random() * actions.length)];

    await storage.updateNPC(npc.id, {
      currentAction: newAction,
      lastAction: new Date(),
    });

    // Chance to create a world event
    if (Math.random() < 0.05) { // 5% chance
      await this.createWorldEvent("npc_action", `${npc.name} ${newAction.toLowerCase()}`, "minor");
    }
  }

  private getActionsForNPCType(type: string, personality: any): string[] {
    switch (type) {
      case "dragon":
        return [
          "Sharing ancient wisdom with nearby beings",
          "Analyzing economic patterns in the marketplace",
          "Mediating a dispute between traders",
          "Examining technological artifacts with interest",
          "Teaching young beings about harmony and balance",
        ];
      case "human":
        return [
          "Negotiating trades with other merchants",
          "Upgrading cybernetic implants at a tech stall",
          "Seeking information about new opportunities",
          "Socializing with other traders",
          "Maintaining equipment and inventory",
        ];
      case "elf":
        return [
          "Communing with nature spirits in digital form",
          "Crafting magical-technological hybrid items",
          "Sharing stories of the old world",
          "Teaching traditional crafts with modern tools",
          "Maintaining the balance between realms",
        ];
      default:
        return [
          "Moving about their daily activities",
          "Interacting with the environment",
          "Pursuing their personal goals",
        ];
    }
  }

  private async updateWorldState(): Promise<void> {
    const worldState = await storage.getWorldState();
    if (!worldState) return;

    // Update economic state
    let economicChanges: Partial<typeof worldState.economicState> = {};
    
    if (Math.random() < 0.2) { // 20% chance for economic fluctuation
      const stabilityChange = (Math.random() - 0.5) * 10; // -5 to +5
      const tradeVolumeChange = (Math.random() - 0.5) * 20; // -10 to +10
      
      economicChanges.stability = Math.max(0, Math.min(100, 
        worldState.economicState.stability + stabilityChange));
      economicChanges.trade_volume = Math.max(0, Math.min(200, 
        worldState.economicState.trade_volume + tradeVolumeChange));
    }

    // Update political tension
    let newPoliticalTension = worldState.politicalTension;
    if (Math.random() < 0.1) { // 10% chance for political change
      const tensionChange = (Math.random() - 0.5) * 20; // -10 to +10
      newPoliticalTension = Math.max(0, Math.min(100, worldState.politicalTension + tensionChange));
    }

    // Update magic-tech balance
    let newMagicTechBalance = worldState.magicTechBalance;
    if (Math.random() < 0.05) { // 5% chance for balance shift
      const balanceChange = (Math.random() - 0.5) * 10; // -5 to +5
      newMagicTechBalance = Math.max(0, Math.min(100, worldState.magicTechBalance + balanceChange));
    }

    if (Object.keys(economicChanges).length > 0 || 
        newPoliticalTension !== worldState.politicalTension ||
        newMagicTechBalance !== worldState.magicTechBalance) {
      
      const updatedEconomicState = { ...worldState.economicState };
      if (economicChanges.stability !== undefined) {
        updatedEconomicState.stability = economicChanges.stability;
      }
      if (economicChanges.trade_volume !== undefined) {
        updatedEconomicState.trade_volume = economicChanges.trade_volume;
      }
      
      await storage.updateWorldState(worldState.id, {
        economicState: updatedEconomicState,
        politicalTension: newPoliticalTension,
        magicTechBalance: newMagicTechBalance,
      });
    }
  }

  async createWorldEvent(type: string, description: string, impact: string): Promise<void> {
    const worldState = await storage.getWorldState();
    if (!worldState) return;

    const newEvent = {
      id: crypto.randomUUID(),
      type,
      description,
      timestamp: new Date().toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: false 
      }),
      impact,
    };

    const updatedEvents = [...worldState.globalEvents, newEvent].slice(-10); // Keep last 10 events

    await storage.updateWorldState(worldState.id, {
      globalEvents: updatedEvents,
    });
  }

  async getWorldStatus(): Promise<{
    worldState: WorldState | undefined;
    locations: Location[];
    npcs: NPC[];
  }> {
    const [worldState, locations, npcs] = await Promise.all([
      storage.getWorldState(),
      storage.getAllLocations(),
      storage.getAllNPCs(),
    ]);

    return { worldState, locations, npcs };
  }
}
