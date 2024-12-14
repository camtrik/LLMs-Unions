import { chatgpt } from "./gpt";
import { claude } from "./claude";
import type { ChatMessage } from "@/types";

export async function chat(messageList: ChatMessage[], apiKey: string, model: string) {
    switch (model) {
        case 'chatgpt':
            return await chatgpt(messageList, apiKey);
        case 'claude':
            return await claude(messageList, apiKey);
        default:
            throw new Error('Invalid model');
    }
}