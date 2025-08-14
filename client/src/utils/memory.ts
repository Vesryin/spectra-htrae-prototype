interface Memory {
	content: string;
	type: "short-term" | "long-term";
	expires: number;
}

const memoryStore: Memory[] = [];

export function addMemory(content: string, type: "short-term" | "long-term", duration: number) {
	const expires = Date.now() + duration * 1000;
	memoryStore.push({ content, type, expires });
}

export function recallMemory(query: string): Memory[] {
	const now = Date.now();
	return memoryStore.filter(m => m.expires > now && m.content.toLowerCase().includes(query.toLowerCase()));
}
