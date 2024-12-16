// src/libs/claude.ts
import type { ChatMessage } from "@/types";

export async function claude(messageList: ChatMessage[], apiKey: string) {
  try {
    const result = await fetch("http://localhost:3000/api/claude", {
      method: "POST",
      headers: {
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        messages: messageList,
        max_tokens: 1024,
        stream: true
      }),
    });
    return result;
  } catch (error: any) {
    console.log(error)
    throw error;
  }
}