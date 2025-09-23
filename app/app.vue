<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <UButton @click="save" :disabled="!gameReady">Save</UButton>
  </UApp>
</template>

<script setup lang="ts">
import { useGame, useGameAsync } from "~/composables/useGame";

const gameReady = ref(false);

const save = async () => {
  if (!gameReady.value) return;

  try {
    const gameManager = useGame(); // 已经初始化完成，可以同步获取
    // const exportData = await gameManager.exportAllData();
    // localStorage.setItem("idle_game", exportData);
    console.log("Game saved");
  } catch (error) {
    console.error("Save failed:", error);
  }
};

onMounted(async () => {
  try {
    await useGameAsync(); // 确保初始化完成
    gameReady.value = true;
  } catch (error) {
    console.error("Game initialization failed:", error);
  }
});
</script>
