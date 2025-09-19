import { SaveManager } from "./SaveManager";

class GameManager {
  level: number;

  constructor() {
    this.level = 1;
    this.initialize();
  }

  private initialize() {
    console.log("GameManager initialized");
  }

  getLevel() {
    return this.level;
  }

  setLevel(level: number) {
    this.level = level;
  }
}

type GameManagerType = GameManager;

export { GameManager };
export type { GameManagerType };
