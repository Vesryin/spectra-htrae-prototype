export function getMoodColor(mood: Mood): string {
	switch (mood) {
		case "Curious": return "#22c55e"; // green-500
		case "Playful": return "#ec4899"; // pink-500
		case "Serene": return "#38bdf8"; // blue-400
		case "Focused": return "#ef4444"; // red-500
		default: return "#a78bfa"; // indigo-400
	}
}
export type Mood = "Curious" | "Playful" | "Serene" | "Focused";

export function getMoodEmoji(mood: Mood): string {
	switch (mood) {
		case "Curious": return "🧐";
		case "Playful": return "😄";
		case "Serene": return "😌";
		case "Focused": return "🤓";
		default: return "✨";
	}
}
