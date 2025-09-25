import { useGameAsync } from "~/composables/useGame";

export default defineNuxtPlugin(async () => {
  // 只在客户端初始化
  if (import.meta.client) {
    await useGameAsync();

    console.log("GameManager initialized");
  }
});
