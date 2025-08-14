import { recallMemory, addMemory } from "./memory";

export type Action = "messageUser" | "startQuest" | "exploreWorld";

interface AutonomyEvent {
  type: Action;
  content: string;
}

const worldEvents = [
  "A glowing artifact appears in the Neon Sprawl.",
  "A cyber-dragon flies over the city.",
  "A mysterious signal pulses through the network."
];

const userMessages = [
  "Hey, have you explored the Sky District today?",
  "I found a strange dragon rune!",
  "Do you remember the last cyber-tech anomaly?"
];

export const getAutonomousAction = (): AutonomyEvent => {
  const roll = Math.random();
  if (roll < 0.4) {
    return { type: "messageUser", content: userMessages[Math.floor(Math.random() * userMessages.length)] };
  } else if (roll < 0.7) {
    const memories = recallMemory("quest");
    const content = memories.length ? `Continuing quest: ${memories[0].content}` : "Starting a new quest in the city.";
    return { type: "startQuest", content };
  } else {
    return { type: "exploreWorld", content: worldEvents[Math.floor(Math.random() * worldEvents.length)] };
  }
};