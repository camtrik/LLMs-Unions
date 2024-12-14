<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold text-zinc-300 mb-4">Choose Model</h2>
    <div
      v-for="model in models"
      :key="model.id"
      :class="[
        'flex items-center p-3 mb-3 sidebar-item',
        selectedModel === model.id 
          ? 'sidebar-item-active'
          : 'sidebar-item-inactive'
      ]"   
      @click="selectModel(model.id)"
    >
      <img :src="model.icon" alt="model.name" class="w-10 h-10 mr-3 rounded-full"/>
      <span class="text-lg">{{ model.name }}</span> 
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { models } from '@/config/models'

const selectedModel = ref('chatgpt')
const emit = defineEmits(['model-change'])

const selectModel = (modelId: string) => {
    selectedModel.value = modelId
    emit('model-change', modelId)
}
</script>