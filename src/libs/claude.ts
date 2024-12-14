// src/libs/claude.ts
import type { ChatMessage } from "@/types";

export async function claude(messageList: ChatMessage[], apiKey: string) {
  try {
    const result = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "x-api-key": "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",
        "anthropic-dangerous-direct-browser-access": "true"  // 添加这个头部
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        messages: messageList,
        max_tokens: 1024,
        stream: true
      }),
    });
    console.log(result)
    return result;
  } catch (error: any) {
    console.log(error)
    throw error;
  }
}