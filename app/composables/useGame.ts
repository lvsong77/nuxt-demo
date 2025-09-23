import { GameManager } from "~~/core/managers/GameManager";
import { IndexedDBGameStorage } from "~~/adapters/storage/IndexdDBGameStorage";

let gameManager: GameManager | null = null;
let initPromise: Promise<GameManager> | null = null;

export function useGame(): GameManager {
  if (gameManager) {
    return gameManager;
  }

  // 如果正在初始化，抛出错误提示
  throw new Error(
    "GameManager not initialized yet. Use useGameAsync() instead."
  );
}

export async function useGameAsync(): Promise<GameManager> {
  if (gameManager) {
    return gameManager;
  }

  if (!initPromise) {
    initPromise = initializeGameManager();
  }

  return await initPromise;
}

async function initializeGameManager(): Promise<GameManager> {
  const storage = new IndexedDBGameStorage();
  gameManager = new GameManager(storage);

  // 等待初始化完成
  await gameManager.waitForInitialization();

  return gameManager;
}
