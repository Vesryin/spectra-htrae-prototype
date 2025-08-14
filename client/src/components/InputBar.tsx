import React, { FormEvent } from "react";

interface InputBarProps {
  readonly input: string;
  readonly setInput: (val: string) => void;
  readonly handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function InputBar({ input, setInput, handleSubmit }: InputBarProps) {
  return (
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
  );
}