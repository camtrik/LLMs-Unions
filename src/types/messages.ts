export interface ChatMessage {
    role: "user" | "assistant";
    content: string; 
}

export interface ChatSession {
    model: string;
    messages: ChatMessage[];
}