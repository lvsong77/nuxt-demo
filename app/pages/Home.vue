<template>
  <div>currentCharacter: {{ currentCharacterId }}</div>
</template>

<script setup lang="ts">
import { useGameAsync } from "~/composables/useGame";

const currentCharacterId = ref("");

onMounted(async () => {
  const gameManager = await useGameAsync();
  currentCharacterId.value = gameManager.currentCharacterId;
});
</script>
