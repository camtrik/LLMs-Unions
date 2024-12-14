<template>
  <div class="max-w-md text-zinc-200 p-8">
    <h2 class="h2">Settings</h2>
    <h3>API Keys</h3>

    <!-- GPT API Key -->
    <div class="api-key-section">
      <label for="gptApiKey">GPT</label>
      <input
        class="input-base w-64"
        id="gptApiKey"
        type="password"
        v-model="apiKeys.gpt"
        placeholder="Enter GPT API Key"
      />
    </div>

    <!-- Claude API Key -->
    <div class="api-key-section">
      <label for="claudeApiKey">Claude</label>
      <input
        class="input-base w-64"
        id="claudeApiKey"
        type="password"
        v-model="apiKeys.claude"
        placeholder="Enter Claude API Key"
      />
    </div>

    <!-- Gemini API Key -->
    <div class="api-key-section">
      <label for="geminiApiKey">Gemini</label>
      <input
        class="input-base w-64"
        id="geminiApiKey"
        type="password"
        v-model="apiKeys.gemini"
        placeholder="Enter Gemini API Key"
      />
    </div>

    <button class="btn h-12 w-24 text-base" @click="saveApiKeys">Save</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import cryptoJS from 'crypto-js';

// Ref to hold API keys
const apiKeys = ref({
  gpt: '',
  claude: '',
  gemini: ''
});

// Function to encrypt and save API keys to localStorage
const getSecretKey = () => "ebbi";
const saveApiKeys = () => {
  if (apiKeys.value.gpt) {
    const encryptedGptKey = cryptoJS.AES.encrypt(apiKeys.value.gpt, getSecretKey()).toString();
    localStorage.setItem("gptAPIKey", encryptedGptKey);
  }
  if (apiKeys.value.claude) {
    const encryptedClaudeKey = cryptoJS.AES.encrypt(apiKeys.value.claude, getSecretKey()).toString();
    localStorage.setItem("claudeAPIKey", encryptedClaudeKey);
  }
  if (apiKeys.value.gemini) {
    const encryptedGeminiKey = cryptoJS.AES.encrypt(apiKeys.value.gemini, getSecretKey()).toString();
    localStorage.setItem("geminiAPIKey", encryptedGeminiKey);
  }
  alert("API Keys saved successfully!");
};
</script>

<style scoped>
.api-key-section {
  @apply mb-6
}

label {
  @apply block mb-2 text-base text-zinc-400
}
</style>
