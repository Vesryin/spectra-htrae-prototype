export interface MemoryEntry {
  id: number;
  content: string;
  type: "short-term" | "long-term";
  importance: number; // 0-10
  timestamp: number;
}

let memoryStore: MemoryEntry[] = [];

// Add a memory
export const addMemory = (
  content: string,
  type: "short-term" | "long-term",
  importance = 5
) => {
  const entry: MemoryEntry = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    content,
    type,
    importance,
    timestamp: Date.now()
  };
  memoryStore.push(entry);
};

// Recall relevant memories (sorted by importance)
export const recallMemory = (keyword: string): MemoryEntry[] => {
  return memoryStore
    .filter(entry => entry.content.toLowerCase().includes(keyword.toLowerCase()))
    .sort((a, b) => b.importance - a.importance);
};

// Decay short-term memory over time
export const decayMemory = (decayRate = 1) => {
  memoryStore = memoryStore.map(entry => {
    if (entry.type === "short-term") {
      return { ...entry, importance: entry.importance - decayRate };
    }
    return entry;
  }).filter(entry => entry.importance > 0 || entry.type === "long-term");
};

// Retrieve all memories (for debugging / future reference)
export const getAllMemory = () => [...memoryStore];