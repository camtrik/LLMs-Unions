<template>
  <div class="flex flex-col h-screen">
    <div
      class="flex flex-nowrap fixed w-full items-baseline top-0 px-6 py-4 bg-zinc-900 top-0"
    >
      <div class="text-2xl font-bold text-zinc-200">{{ modelInfo?.name }}</div>
      <div
        class="ml-auto px-3 py-2 text-sm cursor-pointer hover:bg-white hover:bg-opacity-10 rounded-md"
      >
        设置
      </div>
    </div>

    <div class="flex-1 mx-2 mt-20 mb-2" ref="chatListDom">
      <div
        class="group flex flex-col px-4 py-3 hover:bg-zinc-800 rounded-lg"
        v-for="item of currentMessages"
      >
        <div class="flex justify-between items-center mb-2">
          <div class="font-bold text-zinc-200">{{ modelInfo?.name }}：</div>
          <Copy class="invisible group-hover:visible" :content="item.content" />
        </div>
        <div>
          <div
            class="prose text-sm text-zinc-200 leading-relaxed"
            v-if="item.content"
            v-html="md.render(item.content)"
          ></div>
          <Loading v-else />
        </div>
      </div>
    </div>

    <div class="sticky bottom-0 w-full p-6 pb-8 bg-zinc-900">
      <div class="flex">
        <input
          class="input-base"
          type="text"
          placeholder="请输入"
          v-model="messageContent"
          @keydown.enter="isTalking || sendChatMessage()"
        />
        <button 
          class="btn"
          :disabled="isTalking" 
          @click="sendChatMessage()"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from 'vue';
import type { ChatMessage, ChatSession } from '@/types';
import cryptoJS from "crypto-js";
import Loading from '../components/Loading.vue'
import Copy from '../components/Copy.vue'
import { md } from '@/libs/markdown';
import { chat } from '@/libs/chat';
import { getModelById } from '@/config/models';
import { chatgpt } from '@/libs/gpt';
import { claude } from '@/libs/claude';
import { Data } from '@icon-park/vue-next';
import { gemini } from '@/libs/gemini';

let gptAPIKey = "";
let claudeAPIKey = "";
let geminiAPIKey = "";
let haveApiKey = ref(false);
let isTalking = ref(false);
let messageContent = ref("");
const decoder = new TextDecoder("utf-8");
const props = defineProps<{
  selectedModel: string;
}>();

const roleAlias = { user: "ME", assistant: "ChatGPT"};

const chatSessions = ref<Record<string, ChatSession>> ({
  chatgpt: {
    model: 'chatgpt',
    messages: [
      {
        role: "assistant",
        content: `你好，我是ChatGPT，我可以提供一些常用服务和信息。`  
      }
    ]
  },
  claude: {
    model: 'claude',
    messages: [
      {
        role: "assistant",
        content: `你好，我是 Claude，让我来协助你。`  
      }
    ]
  }, 
  gemini: {
    model: 'gemini',
    messages: [
      {
        role: "user",
        content: `你好，我是Gemini，你可以帮我做些什么呢？`  
      }
    ]
  }
});

const modelInfo = computed(() => getModelById(props.selectedModel))

const currentMessages = computed(() => 
  chatSessions.value[props.selectedModel]?.messages || []
);

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
    const currentSession = chatSessions.value[props.selectedModel]

    if (isFirstMessage(currentSession)) {
      currentSession.messages = [];
    }
    currentSession.messages.push({
      role: "user",
      content,
    });
    clearMessageContent();
    currentSession.messages.push({
      role: "assistant",
      content: "",
    });

    const response = await chat(currentSession.messages, getAPIKey(), props.selectedModel);

    // gemini don't support stream
    if (props.selectedModel=== 'gemini') {
      const data = await response.json();
      appendLastMessageContent(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "");
    } else {
      if (response.body) {
        const reader = response.body.getReader();
        await readStream(reader, response.status);
      }
    }
  } catch (error: any) {
    appendLastMessageContent(error);
  } finally {
    isTalking.value = false;
  }
}
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
      if (line.startsWith("event:")) continue; // claude starts with event
      if (line.length === 0 || line.startsWith(":")) continue;
      try {
        const json = JSON.parse(line.substring(6));
        const content = processModelResponseStream(json, line, status);
        if (content) {
          appendLastMessageContent(content);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}

const processModelResponseStream = (json: any, line: string, status: number) => {
  switch (props.selectedModel) {
    case 'chatgpt':
      if (line === "data: [DONE]") return;
        return status === 200 
          ? json.choices[0].delta.content ?? ""
          : json.error.message;
      break;
    case 'claude':
      if (json.type === 'content_block_delta') {
        return json.delta.text ?? "";
      }
      return "";
    default:
      return null;
  }
}

const isFirstMessage = (session: ChatSession) => {
  return session.messages.length === 1 && session.messages[0].role === "assistant";
}

const appendLastMessageContent = (content: string) => {
  const currentSession = chatSessions.value[props.selectedModel];
  const lastMessage = currentSession.messages[currentSession.messages.length - 1];
  lastMessage.content += content;
}
  
const clearMessageContent = () => 
  messageContent.value = "";
  
// API key  
const getSecretKey = () => "ebbi";


const getAPIKey = () => {
  if (props.selectedModel === 'chatgpt') {
    return getGPTAPIKey();
  } else if (props.selectedModel === 'claude') {
    return getClaudeAPIKey();
  } else if (props.selectedModel === 'gemini') {
    return getGeminiAPIKey();
  }
  throw new Error(`No API key for model: ${props.selectedModel}`);
};

const getGPTAPIKey = () => {
  if (gptAPIKey) return gptAPIKey;
  const aesAPIKey = localStorage.getItem("gptAPIKey") ?? "";

  gptAPIKey = cryptoJS.AES.decrypt(aesAPIKey, getSecretKey()).toString(
    cryptoJS.enc.Utf8
  );
  return gptAPIKey;
};

const getClaudeAPIKey = () => {
  if (claudeAPIKey) return claudeAPIKey;
  const aesAPIKey = localStorage.getItem("claudeAPIKey") ?? "";

  claudeAPIKey = cryptoJS.AES.decrypt(aesAPIKey, getSecretKey()).toString(
    cryptoJS.enc.Utf8
  );
  return claudeAPIKey;
}

const getGeminiAPIKey = () => {
  if (geminiAPIKey) return geminiAPIKey;
  const aesAPIKey = localStorage.getItem("geminiAPIKey") ?? "";

  geminiAPIKey = cryptoJS.AES.decrypt(aesAPIKey, getSecretKey()).toString(
    cryptoJS.enc.Utf8
  );
  return geminiAPIKey;
}

</script>

<style>
.prose ol {
  @apply list-decimal pl-8;
}

.prose ol li {
  @apply mb-2;
}
</style>