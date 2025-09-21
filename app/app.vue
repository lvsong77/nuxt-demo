<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <UButton @click="save">save</UButton>
  </UApp>
</template>

<script setup lang="ts">
import { useGame } from "~/stores/game";

const initGameManager = () => {
  const game = useGame();
  if (import.meta.client) {
    game.initGameManager();
  }
};

const save = () => {
  const game = useGame();
  game.saveData();
};

onBeforeMount(() => {
  initGameManager();
});
</script>
