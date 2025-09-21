import { GameManager } from "~~/core/managers/GameManager";
import type { GameManagerType } from "~~/core/managers/GameManager";

export const useGame = defineStore("game", {
  state: () => ({
    gameManager: null as unknown as GameManagerType,
  }),
  actions: {
    initGameManager() {
      this.gameManager = new GameManager();
      console.log("🚀 ~ initGameManager ~ this.gameManager:", this.gameManager)
      this.gameManager.load(localStorage.getItem('idle_game') ?? '{}');
    },
    saveData() {
      const saveData = this.gameManager.save();
      localStorage.setItem('idle_game', saveData);
    }
  },
  getters: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGame, import.meta.hot));
}
