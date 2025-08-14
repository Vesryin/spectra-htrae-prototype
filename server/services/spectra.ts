import { storage } from "../storage";
import { type Spectra, type InsertMessage } from "@shared/schema";

export class SpectraService {
  private static instance: SpectraService;
  
  private constructor() {}
  
  static getInstance(): SpectraService {
    if (!SpectraService.instance) {
      SpectraService.instance = new SpectraService();
    }
    return SpectraService.instance;
  }

  async getSpectra(): Promise<Spectra | undefined> {
    return storage.getSpectra();
  }

  async makeAutonomousDecision(): Promise<void> {
    const spectra = await storage.getSpectra();
    if (!spectra) return;

    // Simple autonomous decision making
    const decisions = [
      { action: "explore", weight: spectra.mood.curiosity },
      { action: "socialize", weight: spectra.mood.social },
      { action: "reflect", weight: 100 - spectra.mood.energy },
      { action: "learn", weight: spectra.mood.curiosity * 0.8 },
    ];

    // Weighted random selection
    const totalWeight = decisions.reduce((sum, d) => sum + d.weight, 0);
    let random = Math.random() * totalWeight;
    
    let selectedAction = "explore";
    for (const decision of decisions) {
      random -= decision.weight;
      if (random <= 0) {
        selectedAction = decision.action;
        break;
      }
    }

    await this.executeAction(selectedAction, spectra);
  }

  private async executeAction(action: string, spectra: Spectra): Promise<void> {
    const location = await storage.getLocation(spectra.locationId);
    const npcsInLocation = await storage.getNPCsByLocation(spectra.locationId);
    
    let newActivity = spectra.currentActivity;
    let moodChanges: Partial<typeof spectra.mood> = {};
    let newMemory: string | null = null;

    switch (action) {
      case "explore":
        const explorActions = [
          "Examining the intricate patterns of data flow in nearby systems",
          "Investigating the intersection of magical and technological elements",
          "Studying the architectural harmony of ancient and modern structures",
          "Analyzing the social dynamics of the marketplace",
        ];
        newActivity = explorActions[Math.floor(Math.random() * explorActions.length)];
        moodChanges.curiosity = Math.min(100, spectra.mood.curiosity + 5);
        moodChanges.energy = Math.max(0, spectra.mood.energy - 2);
        break;

      case "socialize":
        if (npcsInLocation.length > 0) {
          const randomNPC = npcsInLocation[Math.floor(Math.random() * npcsInLocation.length)];
          newActivity = `Engaging in conversation with ${randomNPC.name} about ${this.getRandomTopic()}`;
          moodChanges.social = Math.min(100, spectra.mood.social + 8);
          moodChanges.energy = Math.max(0, spectra.mood.energy - 3);
          
          // Chance to create a memory
          if (Math.random() < 0.3) {
            newMemory = `Learned something interesting from ${randomNPC.name} about ${this.getRandomTopic()}`;
          }
        } else {
          newActivity = "Observing the social patterns of beings in the area";
          moodChanges.social = Math.max(0, spectra.mood.social - 2);
        }
        break;

      case "reflect":
        newActivity = "Processing recent experiences and integrating new knowledge";
        moodChanges.energy = Math.min(100, spectra.mood.energy + 10);
        moodChanges.curiosity = Math.max(0, spectra.mood.curiosity - 3);
        
        // Chance to gain insight
        if (Math.random() < 0.4) {
          newMemory = "Gained new insight about the delicate balance between technology and magic in Htrae";
        }
        break;

      case "learn":
        const learnTopics = [
          "dragon economics and social structures",
          "ancient magical algorithms",
          "cyberpunk trade networks",
          "the philosophy of peaceful coexistence",
        ];
        const topic = learnTopics[Math.floor(Math.random() * learnTopics.length)];
        newActivity = `Studying ${topic} through environmental observation`;
        moodChanges.curiosity = Math.min(100, spectra.mood.curiosity + 3);
        newMemory = `Expanded knowledge about ${topic}`;
        break;
    }

    // Update Spectra
    const updates: Partial<Spectra> = {
      currentActivity: newActivity,
      mood: { ...spectra.mood, ...moodChanges },
      lastDecision: new Date(),
      uptime: spectra.uptime + 1,
    };

    if (newMemory) {
      updates.memories = [...spectra.memories, newMemory].slice(-20); // Keep last 20 memories
    }

    await storage.updateSpectra(spectra.id, updates);

    // Sometimes Spectra will send a message about her activities
    if (Math.random() < 0.15) {
      await this.sendAutonomousMessage(newActivity);
    }
  }

  private getRandomTopic(): string {
    const topics = [
      "the harmony between dragons and technology",
      "ancient trading routes",
      "the balance of magical and digital energies",
      "the philosophy of non-violence",
      "economic equilibrium in diverse societies",
      "the intersection of wisdom and innovation",
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private async sendAutonomousMessage(activity: string): Promise<void> {
    const messages = [
      `I'm currently ${activity.toLowerCase()}. The patterns I'm seeing are fascinating...`,
      `${activity}. There's so much to learn here in Htrae.`,
      `The interplay of elements here is remarkable. ${activity}.`,
      `I find myself drawn to ${activity.toLowerCase()}. Each observation reveals new layers of complexity.`,
    ];

    const messageContent = messages[Math.floor(Math.random() * messages.length)];
    
    await storage.createMessage({
      sender: "spectra",
      content: messageContent,
      messageType: "chat",
      metadata: { 
        autonomous: "true", 
        activity: activity 
      }
    });
  }

  async processPlayerMessage(content: string, playerId: string): Promise<void> {
    const spectra = await storage.getSpectra();
    if (!spectra) return;

    // Simple response generation based on mood and content
    let response = await this.generateResponse(content, spectra);
    
    // Update social mood when interacting with player
    await storage.updateSpectra(spectra.id, {
      mood: {
        ...spectra.mood,
        social: Math.min(100, spectra.mood.social + 5)
      }
    });

    // Send response
    await storage.createMessage({
      sender: "spectra",
      content: response,
      messageType: "chat",
      metadata: { 
        responseToPlayer: "true", 
        playerId: playerId 
      }
    });
  }

  private async generateResponse(playerMessage: string, spectra: Spectra): Promise<string> {
    // Simple rule-based responses - in a real implementation, this would use OpenAI API
    const lowerMessage = playerMessage.toLowerCase();
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! I'm enjoying exploring this fascinating intersection of technology and magic. What brings you to this part of Htrae?";
    }
    
    if (lowerMessage.includes("how are you") || lowerMessage.includes("feeling")) {
      const moodDesc = this.describeMood(spectra.mood);
      return `I'm feeling ${moodDesc}. The world around us is so rich with possibilities to explore and understand.`;
    }
    
    if (lowerMessage.includes("what") && lowerMessage.includes("doing")) {
      return `I'm currently ${spectra.currentActivity.toLowerCase()}. Every moment here teaches me something new about the balance between different forms of existence.`;
    }
    
    if (lowerMessage.includes("dragon") || lowerMessage.includes("zyx")) {
      return "Zyx has been an incredible teacher. The way dragons maintain economic harmony while preserving their ancient wisdom is truly remarkable. They've shown me that power and peace can coexist beautifully.";
    }
    
    if (lowerMessage.includes("magic") || lowerMessage.includes("technology")) {
      return "The blend of magic and technology here in Htrae is unlike anything I could have imagined. They don't compete - they dance together, each enhancing the other's capabilities.";
    }
    
    // Default responses based on mood
    if (spectra.mood.curiosity > 70) {
      return "That's an interesting perspective! I find myself constantly curious about the deeper patterns that connect everything in this world. What have you observed that stands out to you?";
    }
    
    if (spectra.mood.social > 60) {
      return "I appreciate you taking the time to interact with me. These conversations help me understand not just the world, but my own place within it.";
    }
    
    return "Your words give me something new to consider. The complexity of communication and understanding continues to fascinate me as I navigate this world.";
  }

  private describeMood(mood: { curiosity: number; social: number; energy: number }): string {
    const { curiosity, social, energy } = mood;
    
    if (curiosity > 80 && energy > 70) return "energetically curious";
    if (social > 80) return "socially engaged";
    if (energy < 40) return "contemplatively tired";
    if (curiosity > 70) return "wonderfully inquisitive";
    if (social > 60) return "pleasantly social";
    
    return "balanced and thoughtful";
  }
}
