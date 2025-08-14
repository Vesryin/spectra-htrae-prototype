import React, { useEffect, useState } from "react";
import { Mood, getMoodColor, getMoodEmoji } from "../utils/moods";

interface AvatarProps {
  mood: Mood;
  position: { x: number; y: number };
  memoryEvent?: "short-term" | "long-term" | null;
}

export default function Avatar({ mood, position, memoryEvent }: AvatarProps) {
  const [glow, setGlow] = useState(0);
  const [emoji, setEmoji] = useState(getMoodEmoji(mood));

  useEffect(() => {
    if (memoryEvent === "long-term") {
      setGlow(20);
      setEmoji("✨"); // sparkle for important memory
      const timeout = setTimeout(() => setGlow(0), 1500);
      return () => clearTimeout(timeout);
    } else if (memoryEvent === "short-term") {
      setGlow(10);
      setEmoji("💭"); // thought bubble for short-term
      const timeout = setTimeout(() => setGlow(0), 1000);
      return () => clearTimeout(timeout);
    }
  }, [memoryEvent]);

  useEffect(() => {
    setEmoji(getMoodEmoji(mood));
  }, [mood]);

  return (
    <div
      className={`absolute w-12 h-12 rounded-full border-2 border-indigo-400 flex items-center justify-center text-white shadow-lg`}
      style={{
        top: `${position.y}%`,
        left: `${position.x}%`,
        backgroundColor: getMoodColor(mood),
        boxShadow: `0 0 ${glow}px ${glow / 2}px #fff`,
        transition: "all 0.5s ease",
      }}
    >
      {emoji}
    </div>
  );
}