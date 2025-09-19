<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
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

onBeforeMount(() => {
  initGameManager();
});
</script>
