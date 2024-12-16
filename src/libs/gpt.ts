import type { ChatMessage } from "@/types";

export async function chatgpt(messageList: ChatMessage[], apiKey: string) {
  try {
    const result = await fetch("http://localhost:3000/api/chatgpt", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: messageList,
      }),
    });
    return result;
  } catch (error) {
    throw error;
  }
}
