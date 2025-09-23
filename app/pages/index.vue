<template>
  <div v-if="loading">
    <div>Loading...</div>
  </div>
  <div v-else-if="characters.length > 0">
    <div v-for="character in characters" :key="character.id">
      {{ character.name }}
    </div>
  </div>
  <div v-else>
    <div>
      <h1>No characters found</h1>
      <UButton @click="createCharacter">Create Character</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameAsync } from "~/composables/useGame";
import type { Character } from "~~/core/entities/creatures/Character";

const characters = ref<Character[]>([]);
const loading = ref(true);

const createCharacter = () => {
  navigateTo("/CharacterCreate");
};

onMounted(async () => {
  try {
    const gameManager = await useGameAsync();
    characters.value = await gameManager.getCharacterList(); // 你需要实现这个方法
    console.log("🚀 ~ characters.value:", characters.value);
  } catch (error) {
    console.error("Failed to load characters:", error);
  } finally {
    loading.value = false;
  }
});
</script>
