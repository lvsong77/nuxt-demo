import { SaveManager } from "./SaveManager";

class GameManager {
  private saveManager: SaveManager;

  constructor() {
    this.saveManager = new SaveManager();
    this.initialize();
  }

  private initialize() {
    console.log("GameManager initialized");
  }
}

export { GameManager };
