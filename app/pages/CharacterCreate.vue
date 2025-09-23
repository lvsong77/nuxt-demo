<template>
  <div>
    <UInput v-model="newCharacter.name" placeholder="输入角色名称" />
    <USelect v-model="newCharacter.gender" :items="genderItems" placeholder="选择性别" />
    <UButton @click="confirm">Create Character</UButton>
  </div>
</template>

<script setup lang="ts">
// import { useGame } from "~/stores/game";
// import { storeToRefs } from "pinia";
import { useGameAsync } from "~/composables/useGame";

// const { gameManager } = storeToRefs(useGame());

const newCharacter = ref({
  name: "",
  gender: "",
});

const genderItems = [
  { label: "男", value: "male" },
  { label: "女", value: "female" },
];

const confirm = async () => {
  // gameManager.value.createCharacter(newCharacter.value);
  const gameManager = await useGameAsync();
  await gameManager.createCharacter(newCharacter.value);
};
</script>
