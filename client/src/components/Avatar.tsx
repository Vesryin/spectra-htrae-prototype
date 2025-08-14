import React from "react";
import { Mood, getMoodColor, getMoodEmoji } from "../utils/moods";

interface AvatarProps {
  readonly mood: Mood;
  readonly position: { x: number; y: number };
}

export default function Avatar({ mood, position }: AvatarProps) {
  return (
    <div
      className={`absolute w-12 h-12 rounded-full border-2 border-indigo-400 flex items-center justify-center text-white shadow-lg`}
      style={{
        top: `${position.y}%`,
        left: `${position.x}%`,
        backgroundColor: getMoodColor(mood),
        transition: "all 1s ease"
      }}
    >
      {getMoodEmoji(mood)}
    </div>
  );
}