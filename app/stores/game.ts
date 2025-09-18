// import type { GameManagerType } from "~/core/managers/GameManager";

export const useGame = defineStore('game', {
  state: () => ({
    // gameManager: null as GameManagerType | null,
    characters: [] as any[],
    currentCharacterId: "",
    currentSceneId: "",
    currentActionId: "",
  }),
  actions: {
    setSaveData() {
      const saveData = {
        characters: this.characters,
        currentCharacterId: this.currentCharacterId,
        currentSceneId: this.currentSceneId,
        currentActionId: this.currentActionId,
      }
      localStorage.setItem('saveData', JSON.stringify(saveData));
    },
    getSaveData() {
      const saveData = JSON.parse(localStorage.getItem('saveData') || '{}');
      this.characters = saveData.characters || [];
      this.currentCharacterId = saveData.currentCharacterId || "";
      this.currentSceneId = saveData.currentSceneId || "";
      this.currentActionId = saveData.currentActionId || "";
    },
    createCharacter(character: any) {
      const id = Date.now().toString();
      this.characters.push({
        ...character,
        id,
      });
      return id
    },
    selectCharacter(id: string) {
      this.currentCharacterId = id;
    }
  },
  getters: {
    getCharacters: (state) => state.characters,
    getCurrentCharacterId: (state) => state.currentCharacterId,
    getCurrentSceneId: (state) => state.currentSceneId,
    getCurrentActionId: (state) => state.currentActionId,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGame, import.meta.hot))
}