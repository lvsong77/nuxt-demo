<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
import { GameManager } from "~~/core/managers/GameManager";

const gameManager = new GameManager();

window.gameManager = gameManager;
</script>
