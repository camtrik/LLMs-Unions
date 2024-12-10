<template>
  <div class="settings-view">
    <h2>Settings</h2>
    <h3>API Keys</h3>

    <!-- GPT API Key -->
    <div class="api-key-section">
      <label for="gptApiKey">GPT</label>
      <input
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
        id="geminiApiKey"
        type="password"
        v-model="apiKeys.gemini"
        placeholder="Enter Gemini API Key"
      />
    </div>

    <button class="save-btn" @click="saveApiKeys">Save</button>
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
.settings-view {
  background-color: #1e1e1e;
  color: #e0e0e0;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #c0c0c0;
}

.api-key-section {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #b0b0b0;
}

input {
  width: 100%;
  padding: 0.75rem;
  background-color: #2a2a2a;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;
}

input::placeholder {
  color: #888;
}

.save-btn {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background-color: #45a049;
}
</style>
