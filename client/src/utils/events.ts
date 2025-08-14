const events = [
	"A neon dragon glides over the Sprawl 🐉✨",
	"Rain falls, shimmering on chrome streets 🌧️",
	"A mysterious hacker leaves a message in the alley 💻",
	"Ancient dragon archives hum with energy 📜"
];

export function getRandomEvent(): string {
	return events[Math.floor(Math.random() * events.length)];
}
