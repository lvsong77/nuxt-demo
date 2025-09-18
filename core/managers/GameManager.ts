import { SaveManager } from "./SaveManager";

class GameManager {
  saveManager: SaveManager;

  constructor() {
    this.saveManager = new SaveManager();
    this.initialize();
  }

  private initialize() {
    console.log("GameManager initialized");
  }
}

type GameManagerType = GameManager;

export { GameManager };
export type { GameManagerType };

