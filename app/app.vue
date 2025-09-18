<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
// import { GameManager } from "~~/core/managers/GameManager";
import { useGame } from "~/stores/game";

// const gameManager = new GameManager();

const game = useGame();

onMounted(() => {
  game.getSaveData();
});
</script>
