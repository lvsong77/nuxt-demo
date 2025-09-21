<template>
  <div v-if="gameManager.characters.length > 0">
    <div
      v-for="character in gameManager.characters"
      :key="character.id"
    >
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
import { useGame } from "~/stores/game";
import { storeToRefs } from "pinia";

const { gameManager } = storeToRefs(useGame());

const createCharacter = () => {
  navigateTo("/CharacterCreate");
};

onMounted(() => {


})
</script>
