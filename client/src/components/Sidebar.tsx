import React from "react";
import { Mood, getMoodColor, getMoodEmoji } from "../utils/moods";

interface Quest {
  id: number;
  title: string;
  active: boolean;
}

interface SidebarProps {
  readonly mood: Mood;
  readonly location: string;
  readonly quests: Quest[];
  readonly onQuestClick: (id: number) => void;
}

export default function Sidebar({ mood, location, quests, onQuestClick }: SidebarProps) {
  return (
    <div className="md:w-1/4 bg-black/70 p-4 flex flex-col gap-4 shadow-xl animate-pulse relative">
      <div className={`bg-purple-800/60 p-3 rounded-lg shadow-lg border border-indigo-400`}>
        <h2 className="font-bold text-xl mb-1">Spectra</h2>
        <p>Mood: <span className={getMoodColor(mood)}>{mood} {getMoodEmoji(mood)}</span></p>
        <p>Location: <span className="text-indigo-300">{location}</span></p>
      </div>

      <div className="bg-purple-800/60 p-3 rounded-lg shadow-lg border border-indigo-400 flex-1">
        <h3 className="font-semibold mb-2">Quests & Notes</h3>
        <ul className="list-disc ml-4 space-y-1">
          {quests.map(q => (
            <li key={q.id} className="list-none">
              <button
                className={`w-full text-left px-2 py-1 rounded ${q.active ? "hover:text-indigo-400 cursor-pointer" : "line-through text-gray-500 cursor-not-allowed"}`}
                onClick={() => q.active && onQuestClick(q.id)}
                disabled={!q.active}
                aria-disabled={!q.active}
              >
                {q.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}