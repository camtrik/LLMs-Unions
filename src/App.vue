<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ModelSelector from './components/ModelSelector.vue'
import { ref } from 'vue'

const selectedModel = ref('chatgpt')
const handleModelChange = (modelId: string) => {
  selectedModel.value = modelId
}
</script>

<template>
  <div class="flex h-screen overflow-hidden min-h-screen bg-zinc-900">
    <!-- Selector -->
    <div class="w-64 flex min-h-screen flex-col border-r border-zinc-700 bg-zinc-800">
      <div class="flex-grow">
        <ModelSelector @model-change="handleModelChange"/>
      </div>
      <nav class="p-4 mt-auto border-zinc-700 flex sidebar-nav">
        <RouterLink to="/" class="px-3 py-2 sidebar-item">Home</RouterLink>
        <RouterLink to="/settings" class="px-3 py-2 sidebar-item">Settings</RouterLink>
      </nav>
    </div>
    <div class="flex-1 bg-zinc-900">
      <RouterView :selectedModel="selectedModel" />
    </div>
  </div>

</template>

<!-- <style scoped>
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: auto;
  padding: 1rem 0;
  border-top: 1px solid var(--color-border);
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

@media (min-width: 1024px) {
  nav {
    text-align: left;
    font-size: 1rem;
  }
}
</style> -->