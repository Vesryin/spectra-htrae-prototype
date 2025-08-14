import React, { useState, useEffect, useRef, FormEvent } from "react";

type Mood = "Curious" | "Playful" | "Serene" | "Focused";

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
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  // Mood change every 15s
  useEffect(() => {
    const moods: Mood[] = ["Curious", "Playful", "Serene", "Focused"];
    const interval = setInterval(() => {
      setSpectraMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Autonomous events
  useEffect(() => {
    const events = [
      "A neon dragon glides over the Sprawl 🐉✨",
      "Rain falls, shimmering on chrome streets 🌧️",
      "A mysterious hacker leaves a message in the alley 💻",
      "Ancient dragon archives hum with energy 📜"
    ];
    const interval = setInterval(() => {
      setLog((prev) => [...prev, `🌐 Event: ${events[Math.floor(Math.random() * events.length)]}`]);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Determine color based on mood
  const getMoodColor = (mood: Mood) => {
    switch (mood) {
      case "Curious": return "text-green-300";
      case "Playful": return "text-pink-400";
      case "Serene": return "text-blue-300";
      case "Focused": return "text-red-400";
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    setLog((prev) => [...prev, `🧍 You: ${input}`, `🤖 Spectra: ...`]);
    setInput("");

    const reply = `🤖 Spectra: "I hear you, let's explore ${spectraLocation}!"`;
    let i = 0;
    const interval = setInterval(() => {
      setLog((prev) => [...prev.slice(0, -1), reply.slice(0, i)]);
      i++;
      if (i > reply.length) clearInterval(interval);
    }, 50);
  };

  // Quest click handler
  const handleQuestClick = (id: number) => {
    const quest = quests.find(q => q.id === id);
    if (!quest || !quest.active) return;

    setLog((prev) => [...prev, `📜 Quest Activated: ${quest.title}`]);
    setQuests(prev => prev.map(q => q.id === id ? { ...q, active: false } : q));
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white flex flex-col md:flex-row font-mono overflow-hidden relative">
      {/* Sidebar */}
      <div className="md:w-1/4 bg-black/70 p-4 flex flex-col gap-4 shadow-xl animate-pulse">
        <div className={`bg-purple-800/60 p-3 rounded-lg shadow-lg border border-indigo-400`}>
          <h2 className="font-bold text-xl mb-1">Spectra</h2>
          <p>Mood: <span className={getMoodColor(spectraMood)}>{spectraMood}</span></p>
          <p>Location: <span className="text-indigo-300">{spectraLocation}</span></p>
        </div>

        <div className="bg-purple-800/60 p-3 rounded-lg shadow-lg border border-indigo-400 flex-1">
          <h3 className="font-semibold mb-2">Quests & Notes</h3>
          <ul className="list-disc ml-4 space-y-1">
            {quests.map(q => (
              <li
                key={q.id}
                className={`cursor-pointer ${q.active ? "hover:text-indigo-400" : "line-through text-gray-500"}`}
                onClick={() => handleQuestClick(q.id)}
              >
                {q.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col justify-end relative">
        <div className="flex-1 overflow-y-auto mb-4 space-y-2 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-900">
          {log.map((line, idx) => (
            <p key={idx} className="bg-black/50 p-3 rounded-lg shadow-md hover:bg-black/70 transition duration-200 animate-pulse text-indigo-100">
              {line}
            </p>
          ))}
          <div ref={logEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 bg-black/70 p-2 rounded-lg border border-indigo-500 shadow-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command or message Spectra..."
            className="flex-1 p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 px-5 py-2 rounded-md hover:bg-indigo-500 transition font-semibold">
            Send
          </button>
        </form>
      </div>

      {/* Optional Background Neon Animation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="w-2 h-2 bg-pink-400 absolute animate-ping rounded-full" style={{ top: "10%", left: "20%" }}></div>
        <div className="w-2 h-2 bg-green-400 absolute animate-ping rounded-full" style={{ top: "50%", left: "70%" }}></div>
        <div className="w-2 h-2 bg-blue-400 absolute animate-ping rounded-full" style={{ top: "80%", left: "40%" }}></div>
      </div>
    </div>
  );
}