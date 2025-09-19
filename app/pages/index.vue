<template>
  <!-- <div v-if="characters.length > 0">
    <div
      v-for="character in characters"
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
  </div> -->
  <div>{{ gameManager.getLevel() }}</div>
  <div>{{ gameManager.level }}</div>
  <UButton @click="gameManager.setLevel(gameManager.getLevel() + 1)">Level Up</UButton>
</template>

<script setup lang="ts">
import { useGame } from "~/stores/game";
import { storeToRefs } from "pinia";

const { gameManager } = storeToRefs(useGame());

let a = gameManager.value.getLevel();
console.log(a);

const createCharacter = () => {
  navigateTo("/CharacterCreate");
};
</script>
