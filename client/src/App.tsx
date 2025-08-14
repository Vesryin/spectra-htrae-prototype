import React, { useState, useEffect, FormEvent } from "react";
import Avatar from "./components/Avatar";
import ChatLog from "./components/ChatLog";
import InputBar from "./components/InputBar";
import Sidebar from "./components/Sidebar";
import { Mood, getMoodEmoji } from "./utils/moods";
import { addMemory, recallMemory, decayMemory } from "./utils/memory";
import { getAutonomousAction, Action } from "./utils/autonomy";

interface Quest {
  id: number;
  title: string;
  active: boolean;
}

export default function App() {
  const [log, setLog] = useState<string[]>([
    "🌌 Welcome to Htrae. Spectra is roaming the Sprawl..."
  ]);
  const [input, setInput] = useState<string>("");
  const [spectraMood, setSpectraMood] = useState<Mood>("Curious");
  const [spectraLocation, setSpectraLocation] = useState<string>("Neon Sprawl");
  const [quests, setQuests] = useState<Quest[]>([
    { id: 1, title: "Explore the Sky District 🌆", active: true },
    { id: 2, title: "Check dragon archives 🐉", active: true },
    { id: 3, title: "Investigate cyberpunk tech anomalies ⚡", active: true }
  ]);
  const [avatarPos, setAvatarPos] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const [memoryEvent, setMemoryEvent] = useState<"short-term" | "long-term" | null>(null);

  const typingAudioRef = React.useRef<HTMLAudioElement>(null);
  const notificationAudioRef = React.useRef<HTMLAudioElement>(null);

  // Mood rotation
  useEffect(() => {
    const moods: Mood[] = ["Curious", "Playful", "Serene", "Focused"];
    const interval = setInterval(() => {
      setSpectraMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Autonomous actions
  useEffect(() => {
    const interval = setInterval(() => {
      const action = getAutonomousAction();

      switch (action.type) {
        case "messageUser":
          setLog(prev => [...prev, `📩 Spectra: ${action.content}`]);
          addMemory(`Spectra: ${action.content}`, "short-term", 6);
          setMemoryEvent("short-term");
          break;

        case "startQuest":
          setLog(prev => [...prev, `📜 Spectra initiates: ${action.content}`]);
          addMemory(`Spectra quest: ${action.content}`, "long-term", 8);
          setMemoryEvent("long-term");
          break;

        case "exploreWorld":
          setLog(prev => [...prev, `🌐 Spectra explores: ${action.content}`]);
          addMemory(`Spectra explored: ${action.content}`, "short-term", 5);
          setMemoryEvent("short-term");
          break;
      }
      notificationAudioRef.current?.play();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Memory decay
  useEffect(() => {
    const interval = setInterval(() => {
      decayMemory(1); // decrease importance of short-term memories
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Floating avatar movement
  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarPos({
        x: 20 + Math.random() * 10,
        y: 20 + Math.random() * 10
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle user input
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    addMemory(`User: ${input}`, "short-term", 5);

    setLog(prev => [...prev, `🧍 You: ${input}`, `🤖 Spectra: ...`]);
    setInput("");

    // Memory-based response
    const relevantMemories = recallMemory(input);
    let reply = "";
    if (relevantMemories.length > 0) {
      reply = `🤖 Spectra: "Ah, I remember something about that... ${relevantMemories[0].content}"`;
      setMemoryEvent(relevantMemories[0].type);
    } else {
      reply = `🤖 Spectra: "I hear you, let's explore ${spectraLocation}!"`;
      setMemoryEvent(null);
    }
    addMemory(`Spectra: ${reply}`, "short-term", 6);

    // Typing simulation
    let i = 0;
    const interval = setInterval(() => {
      typingAudioRef.current?.play();
      setLog(prev => [...prev.slice(0, -1), reply.slice(0, i) + ` ${getMoodEmoji(spectraMood)}`]);
      i++;
      if (i > reply.length) clearInterval(interval);
    }, 50);

    // Avatar reacts slightly
    setAvatarPos({
      x: Math.min(90, Math.max(5, avatarPos.x + Math.random() * 20 - 10)),
      y: Math.min(90, Math.max(5, avatarPos.y + Math.random() * 20 - 10))
    });
  };

  const handleQuestClick = (id: number) => {
    const quest = quests.find(q => q.id === id);
    if (!quest || !quest.active) return;

    setLog(prev => [...prev, `📜 Quest Activated: ${quest.title}`]);
    notificationAudioRef.current?.play();
    setQuests(prev => prev.map(q => q.id === id ? { ...q, active: false } : q));
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white flex flex-col md:flex-row font-mono overflow-hidden relative">
      <audio ref={typingAudioRef} src="/sounds/typing.mp3" />
      <audio ref={notificationAudioRef} src="/sounds/notification.mp3" />

      <Sidebar
        mood={spectraMood}
        location={spectraLocation}
        quests={quests}
        onQuestClick={handleQuestClick}
      />

      <Avatar mood={spectraMood} position={avatarPos} memoryEvent={memoryEvent} />

      <div className="flex-1 p-4 flex flex-col justify-end relative">
        <ChatLog log={log} />
        <InputBar input={input} setInput={setInput} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}