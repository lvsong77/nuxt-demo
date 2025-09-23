import { useGame } from "~/composables/useGame";

export default defineNuxtPlugin(async () => {
  // 只在客户端初始化
  if (import.meta.client) {
    const gameManager = useGame();

    // 等待 GameManager 完全初始化
    await gameManager.waitForInitialization(); // 你需要在 GameManager 中添加这个方法

    console.log("GameManager initialized");
  }
});
