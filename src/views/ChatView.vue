<template>
  <div class="flex flex-col h-screen">
    <div
      class="header"
    >
      <div class="title">ChatGPT</div>
      <div class="subtitle">
        基于 OpenAI 的 ChatGPT 自然语言模型人工智能对话
      </div>
      <div
        class="ml-auto px-3 py-2 text-sm cursor-pointer hover:bg-white rounded-md"
      >
        设置
      </div>
    </div>

    <div class="flex-1 mx-2 mt-20 mb-2" ref="chatListDom">
      <div
        class="group flex flex-col px-4 py-3 hover:bg-slate-100 rounded-lg"
        v-for="item of messageList.filter((v) => v.role !== 'system')"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold">{{ roleAlias[item.role] }}：</div>
          <Copy class="invisible group-hover:visible" :content="item.content" />
        </div>
        <div>
          <div
            class="prose text-sm text-gray-100 leading-relaxed"
            v-if="item.content"
            v-html="md.render(item.content)"
          ></div>
          <Loading v-else />
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="input-container">
        <input
          class="input"
          type="text"
          placeholder="请输入"
          v-model="messageContent"
          @keydown.enter="isTalking || sendChatMessage()"
        />
        <button class="btn" :disabled="isTalking" @click="sendChatMessage()">
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, watch, nextTick, onMounted } from 'vue';
import type { ChatMessage } from '@/types';
import cryptoJS from "crypto-js";
import Loading from '../components/Loading.vue'
import Copy from '../components/Copy.vue'
import { md } from '@/libs/markdown';
import { chat } from '@/libs/gpt';

let apiKey = "";
let haveApiKey = ref(false);
let isTalking = ref(false);
let messageContent = ref("");
const decoder = new TextDecoder("utf-8");
const roleAlias = {
  user: "ME", 
  assistant: "GPT",
}
const messageList = ref<ChatMessage[]>([
  {
    role: "system",
    content: "你是 ChatGPT，OpenAI 训练的大型语言模型，尽可能简洁地回答。",
  },
  {
    role: "assistant",
    content: `你好，我是AI语言模型，我可以提供一些常用服务和信息，例如：

1. 翻译：我可以把中文翻译成英文，英文翻译成中文，还有其他一些语言翻译，比如法语、日语、西班牙语等。

2. 咨询服务：如果你有任何问题需要咨询，例如健康、法律、投资等方面，我可以尽可能为你提供帮助。

3. 闲聊：如果你感到寂寞或无聊，我们可以聊一些有趣的话题，以减轻你的压力。

请告诉我你需要哪方面的帮助，我会根据你的需求给你提供相应的信息和建议。`,
  },
]);

onMounted(() => {
  if (getGPTAPIKey()) {
    console.log("GPT API key get");
  } else {
    console.log("GPT API key not found");
  }
});

const sendChatMessage = async(content: string = messageContent.value) => {
  try {
    isTalking.value = true;
    if (messageList.value.length === 2) {
      // if has 2 messages, remove one 
      messageList.value.pop();
    }
    messageList.value.push({
      role: "user",
      content,
    });
    clearMessageContent();
    messageList.value.push({
      role: "assistant",
      content: "",
    });

    const { body, status } = await chat(messageList.value, getGPTAPIKey());
    if (body) {
      const reader = body.getReader();
      await readStream(reader, status);
    }
  } catch (error: any) {
    appendLastMessageContent(error);
  } finally {
    isTalking.value = false;
  }
}

// Using SSE
const readStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>, 
  status: number,
) => {
  let partialLine = "";
  
  while(true) {
    const { value, done } = await reader.read();
    if (done) break;
    
    const decodedText = decoder.decode(value, { stream: true });
    
    if (status != 200) {
      const json = JSON.parse(decodedText);
      const content = json.error.message ?? decodedText;
      appendLastMessageContent(content);
      return; 
    }

    const chunk = partialLine + decodedText;
    const newLines = chunk.split(/\r?\n/);
    
    partialLine = newLines.pop() ?? "";
    
    for (const line of newLines) {
      if (line.length === 0 || line.startsWith(":")) continue; // empty message & sse comment message 
      if (line === "data: [DONE]") return;  // END of stream 
      
      const json = JSON.parse(line.substring(6));
      const content = 
        status === 200 
          ? json.choices[0].delta.content ?? ""
          : json.error.message;
      appendLastMessageContent(content);
    }
  }
}

const appendLastMessageContent = (content: string) =>
  (messageList.value[messageList.value.length - 1].content += content);
  
const clearMessageContent = () => 
  messageContent.value = "";
  
const getSecretKey = () => "ebbi";
const getGPTAPIKey = () => {
  if (apiKey) return apiKey;
  const aesAPIKey = localStorage.getItem("gptAPIKey") ?? "";

  apiKey = cryptoJS.AES.decrypt(aesAPIKey, getSecretKey()).toString(
    cryptoJS.enc.Utf8
  );
  return apiKey;
};

</script>




<style>

.header {
  display: flex;
  flex-wrap: nowrap;
  /* position: top; */
  width: 100%;
  align-items: baseline;
  top: 0;
  padding: 1rem 1.5rem;
  background-color: rgb(32, 31, 31);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: rgb(212, 206, 206);
}

.subtitle {
  margin-left: 1rem;
  font-size: 0.875rem;
  color: white;
}

.footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: 1.5rem 1.5rem 2rem;
  background-color: rgb(32, 31, 31); 
}

.input-container {
  display: flex;
}

.input {
  flex: 1;
  padding: 0.75rem;
  background-color: rgb(45, 45, 45); 
  color: white;
  border: 1px solid rgb(72, 72, 72); 
  border-radius: 0.375rem;
  margin-right: 0.5rem;
}

.input::placeholder {
  color: rgb(150, 150, 150); 
}

.prose ol {
  @apply list-decimal pl-8;
}

.prose ol li {
  @apply mb-2;
}
</style>
