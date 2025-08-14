import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Spectra AI entity
export const spectra = pgTable("spectra", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().default("Spectra"),
  status: text("status").notNull().default("active"), // active, inactive, exploring, communicating
  mood: jsonb("mood").$type<{
    curiosity: number;
    social: number;
    energy: number;
  }>().notNull().default(sql`'{"curiosity": 80, "social": 60, "energy": 85}'::jsonb`),
  currentActivity: text("current_activity").notNull().default("Exploring"),
  locationId: varchar("location_id").notNull(),
  memories: jsonb("memories").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  relationships: jsonb("relationships").$type<Record<string, {
    name: string;
    relationship: string;
    trust: number;
  }>>().notNull().default(sql`'{}'::jsonb`),
  autonomousGoals: jsonb("autonomous_goals").$type<string[]>().notNull().default(sql`'["explore the world", "learn about inhabitants", "understand the balance of technology and magic"]'::jsonb`),
  lastDecision: timestamp("last_decision").notNull().defaultNow(),
  uptime: integer("uptime").notNull().default(0), // in minutes
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// World locations
export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // cyberpunk, fantasy, hybrid, industrial
  connectedLocations: jsonb("connected_locations").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  npcs: jsonb("npcs").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  events: jsonb("events").$type<Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>>().notNull().default(sql`'[]'::jsonb`),
  properties: jsonb("properties").$type<Record<string, any>>().notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// NPCs
export const npcs = pgTable("npcs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // dragon, human, elf, cyborg, alien
  locationId: varchar("location_id").notNull(),
  personality: jsonb("personality").$type<{
    traits: string[];
    goals: string[];
    relationshipToSpectra: string;
  }>().notNull(),
  currentAction: text("current_action").notNull(),
  autonomousLevel: integer("autonomous_level").notNull().default(3), // 1-5, how independent they are
  lastAction: timestamp("last_action").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// World state and events
export const worldState = pgTable("world_state", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  currentDay: integer("current_day").notNull().default(1),
  currentTime: text("current_time").notNull().default("12:00"),
  weatherConditions: jsonb("weather_conditions").$type<Record<string, {
    condition: string;
    intensity: number;
  }>>().notNull().default(sql`'{}'::jsonb`),
  globalEvents: jsonb("global_events").$type<Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    impact: string;
  }>>().notNull().default(sql`'[]'::jsonb`),
  economicState: jsonb("economic_state").$type<Record<string, number>>().notNull().default(sql`'{"stability": 75, "trade_volume": 100}'::jsonb`),
  politicalTension: integer("political_tension").notNull().default(30), // 0-100
  magicTechBalance: integer("magic_tech_balance").notNull().default(50), // 0-100, 0=pure magic, 100=pure tech
  simulationActive: boolean("simulation_active").notNull().default(true),
  lastTick: timestamp("last_tick").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Chat messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sender: text("sender").notNull(), // "player", "spectra", "system"
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  messageType: text("message_type").notNull().default("chat"), // chat, event, system
  urgency: text("urgency").default("normal"), // low, normal, high, critical
  externalDelivery: jsonb("external_delivery").$type<Record<string, any>>().notNull().default(sql`'{}'::jsonb`), // SMS, email, push notification settings
  metadata: jsonb("metadata").$type<Record<string, any>>().notNull().default(sql`'{}'::jsonb`),
});

// Player data
export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().default("Player"),
  isOnline: boolean("is_online").notNull().default(false),
  lastSeen: timestamp("last_seen").notNull().defaultNow(),
  relationshipWithSpectra: text("relationship_with_spectra").notNull().default("curious"),
  influenceLevel: integer("influence_level").notNull().default(1), // 1-10, how much they can influence world
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Quests and missions
export const quests = pgTable("quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  giver: text("giver").notNull(), // NPC or entity that gave the quest
  assignee: text("assignee"), // who the quest is assigned to (spectra, player, etc.)
  status: text("status").notNull().default("active"), // active, completed, failed, abandoned
  objectives: jsonb("objectives").$type<Array<{
    id: string;
    description: string;
    completed: boolean;
    progress?: number;
  }>>().notNull().default(sql`'[]'::jsonb`),
  rewards: jsonb("rewards").$type<Record<string, any>>().notNull().default(sql`'{}'::jsonb`),
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relationships between entities
export const relationships = pgTable("relationships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entityAId: text("entity_a_id").notNull(),
  entityBId: text("entity_b_id").notNull(),
  entityAType: text("entity_a_type").notNull(), // spectra, npc, player
  entityBType: text("entity_b_type").notNull(),
  relationshipType: text("relationship_type").notNull(), // friendship, mentorship, rivalry, romantic, etc.
  strength: integer("strength").notNull().default(50), // 0-100 relationship strength
  trust: integer("trust").notNull().default(50), // 0-100 trust level
  lastInteraction: timestamp("last_interaction").notNull().defaultNow(),
  sharedMemories: jsonb("shared_memories").$type<Array<{
    id: string;
    description: string;
    significance: number;
    timestamp: string;
  }>>().notNull().default(sql`'[]'::jsonb`), // shared memories between entities
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Schema exports
export const insertSpectraSchema = createInsertSchema(spectra).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNpcSchema = createInsertSchema(npcs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorldStateSchema = createInsertSchema(worldState).omit({
  id: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Spectra = typeof spectra.$inferSelect;
export type InsertSpectra = z.infer<typeof insertSpectraSchema>;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type NPC = typeof npcs.$inferSelect;
export type InsertNPC = z.infer<typeof insertNpcSchema>;

export type WorldState = typeof worldState.$inferSelect;
export type InsertWorldState = z.infer<typeof insertWorldStateSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
