<template>
  <div v-if="characters.length > 0">
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
  </div>
</template>

<script setup lang="ts">
import { useGame } from '~/stores/game';
import { storeToRefs } from 'pinia';

const { characters, } = storeToRefs(useGame());

const createCharacter = () => {
  navigateTo('/CharacterCreate');
};


</script>
