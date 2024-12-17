import { chatgpt } from "./gpt";
import { claude } from "./claude";
import type { ChatMessage } from "@/types";
import { gemini } from "./gemini";

export async function chat(messageList: ChatMessage[], apiKey: string, model: string) {
    switch (model) {
        case 'chatgpt':
            return await chatgpt(messageList, apiKey);
        case 'claude':
            return await claude(messageList, apiKey);
        case 'gemini':
            return await gemini(messageList, apiKey);
        default:
            throw new Error('Invalid model');
    }
}