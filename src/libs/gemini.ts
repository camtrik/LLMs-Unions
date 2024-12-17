import type { ChatMessage } from "@/types";

export async function gemini(messageList: ChatMessage[], apiKey: string) {
  try {
    const requestBody = {
      contents: [{
        parts: messageList.map(msg => ({
          text: msg.content
        }))
      }]
    };
    console.log(messageList)
    console.log(JSON.stringify(requestBody, null, 2))
    const result = await fetch("http://localhost:3000/api/gemini", {
      method: "post", 
      headers: {
        "Content-Type": "application/json", 
        "api-key": apiKey, 
      }, 
      body: JSON.stringify(requestBody), 
    });
    return result; 
  } catch (error) {
    throw error;
  }
}