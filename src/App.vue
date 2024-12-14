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
  <div class="flex h-screen bg-zinc-900">
    <!-- Selector -->
    <div class="w-64 flex min-h-screen flex-col border-r border-zinc-700 bg-zinc-800">
      <div class="flex-grow">
        <ModelSelector @model-change="handleModelChange"/>
      </div>
      <nav class="p-4 border-zinc-700 flex">
        <RouterLink to="/" class="px-3 py-2 sidebar-item">Home</RouterLink>
        <RouterLink to="/settings" class="px-3 py-2 sidebar-item">Settings</RouterLink>
      </nav>
    </div>
    <div class="flex-1">
      <RouterView :selectedModel="selectedModel" />
    </div>
  </div>

</template>

