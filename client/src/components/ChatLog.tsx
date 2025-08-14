import React, { useRef, useEffect } from "react";

interface ChatLogProps {
  readonly log: string[];
}

export default function ChatLog({ log }: ChatLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-2 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-900">
      {log.map((line, idx) => (
        <p key={idx + '-' + line.slice(0,10)} className="bg-black/50 p-3 rounded-lg shadow-md hover:bg-black/70 transition duration-200 animate-pulse text-indigo-100">
          {line}
        </p>
      ))}
      <div ref={logEndRef} />
    </div>
  );
}