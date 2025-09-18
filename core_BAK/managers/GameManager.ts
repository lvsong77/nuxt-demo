import { BaseEntity } from "../entities/BaseEntity";

/**
 * 游戏事件接口
 * 定义游戏中可能发生的各种事件
 */
interface GameEvent {
  type: string;
  data?: any;
  timestamp: Date;
}

/**
 * 游戏事件监听器接口
 */
interface GameEventListener {
  onGameEvent(event: GameEvent): void;
}

/**
 * 游戏状态枚举
 */
enum GameState {
  INITIALIZING = "initializing",
  LOADING = "loading",
  RUNNING = "running",
  PAUSED = "paused",
  SAVING = "saving",
  ERROR = "error",
}

/**
 * 游戏总管理器
 * 采用单例模式，负责管理整个游戏的生命周期和核心功能
 *
 * 主要职责：
 * 1. 游戏状态管理
 * 2. 事件系统管理
 * 3. 游戏循环控制
 * 4. 数据持久化协调
 * 5. 系统间通信协调
 */
class GameManager {
  private static instance: GameManager;

  // 游戏状态
  private currentState: GameState = GameState.INITIALIZING;

  // 事件系统
  private eventListeners: Map<string, GameEventListener[]> = new Map();

  // 游戏循环
  private gameLoopId: number | null = null;
  private lastUpdateTime: number = 0;

  // 基础配置
  private readonly config = {
    targetFPS: 60,
    autoSaveInterval: 30000, // 30秒自动保存
    maxEventHistory: 100,
  };

  // 事件历史（用于调试）
  private eventHistory: GameEvent[] = [];

  /**
   * 私有构造函数，确保单例模式
   */
  private constructor() {
    this.initialize();
  }

  /**
   * 获取游戏管理器实例
   */
  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  /**
   * 初始化游戏管理器
   */
  private initialize(): void {
    console.log("GameManager: 正在初始化游戏管理器...");

    // 设置默认事件监听器
    this.setupDefaultEventListeners();

    // 触发初始化完成事件
    this.emitEvent({
      type: "GAME_MANAGER_INITIALIZED",
      timestamp: new Date(),
    });

    this.currentState = GameState.LOADING;
    console.log("GameManager: 游戏管理器初始化完成");
  }

  /**
   * 设置默认事件监听器
   */
  private setupDefaultEventListeners(): void {
    // 监听游戏状态变化
    this.addEventListener("GAME_STATE_CHANGED", {
      onGameEvent: (event: GameEvent) => {
        console.log(`GameManager: 游戏状态变更为 ${event.data.newState}`);
      },
    });
  }

  /**
   * 启动游戏
   */
  public startGame(): void {
    if (this.currentState === GameState.RUNNING) {
      console.log("GameManager: 游戏已经在运行中");
      return;
    }

    console.log("GameManager: 启动游戏...");
    this.changeState(GameState.RUNNING);

    // 启动游戏循环
    this.startGameLoop();

    // 启动自动保存
    this.startAutoSave();

    this.emitEvent({
      type: "GAME_STARTED",
      timestamp: new Date(),
    });
  }

  /**
   * 暂停游戏
   */
  public pauseGame(): void {
    if (this.currentState !== GameState.RUNNING) {
      console.log("GameManager: 游戏未在运行，无法暂停");
      return;
    }

    console.log("GameManager: 暂停游戏...");
    this.changeState(GameState.PAUSED);
    this.stopGameLoop();

    this.emitEvent({
      type: "GAME_PAUSED",
      timestamp: new Date(),
    });
  }

  /**
   * 恢复游戏
   */
  public resumeGame(): void {
    if (this.currentState !== GameState.PAUSED) {
      console.log("GameManager: 游戏未暂停，无法恢复");
      return;
    }

    console.log("GameManager: 恢复游戏...");
    this.changeState(GameState.RUNNING);
    this.startGameLoop();

    this.emitEvent({
      type: "GAME_RESUMED",
      timestamp: new Date(),
    });
  }

  /**
   * 停止游戏
   */
  public stopGame(): void {
    console.log("GameManager: 停止游戏...");
    this.stopGameLoop();
    this.stopAutoSave();

    this.emitEvent({
      type: "GAME_STOPPED",
      timestamp: new Date(),
    });
  }

  /**
   * 启动游戏循环
   */
  private startGameLoop(): void {
    if (this.gameLoopId !== null) {
      return; // 已经在运行
    }

    this.lastUpdateTime = performance.now();

    const gameLoop = (currentTime: number) => {
      if (this.currentState !== GameState.RUNNING) {
        return; // 游戏未运行，退出循环
      }

      const deltaTime = currentTime - this.lastUpdateTime;
      this.lastUpdateTime = currentTime;

      // 触发游戏更新事件
      this.emitEvent({
        type: "GAME_UPDATE",
        data: { deltaTime },
        timestamp: new Date(),
      });

      this.gameLoopId = requestAnimationFrame(gameLoop);
    };

    this.gameLoopId = requestAnimationFrame(gameLoop);
  }

  /**
   * 停止游戏循环
   */
  private stopGameLoop(): void {
    if (this.gameLoopId !== null) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
  }

  /**
   * 启动自动保存
   */
  private startAutoSave(): void {
    // TODO: 实现自动保存逻辑
    console.log("GameManager: 自动保存已启动");
  }

  /**
   * 停止自动保存
   */
  private stopAutoSave(): void {
    // TODO: 实现停止自动保存逻辑
    console.log("GameManager: 自动保存已停止");
  }

  /**
   * 改变游戏状态
   */
  private changeState(newState: GameState): void {
    const oldState = this.currentState;
    this.currentState = newState;

    this.emitEvent({
      type: "GAME_STATE_CHANGED",
      data: { oldState, newState },
      timestamp: new Date(),
    });
  }

  /**
   * 添加事件监听器
   */
  public addEventListener(
    eventType: string,
    listener: GameEventListener
  ): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }

    const listeners = this.eventListeners.get(eventType)!;
    if (!listeners.includes(listener)) {
      listeners.push(listener);
    }
  }

  /**
   * 移除事件监听器
   */
  public removeEventListener(
    eventType: string,
    listener: GameEventListener
  ): void {
    const listeners = this.eventListeners.get(eventType);
    if (!listeners) return;

    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * 发送事件
   */
  public emitEvent(event: GameEvent): void {
    // 添加到历史记录
    this.eventHistory.push(event);

    // 限制历史记录长度
    if (this.eventHistory.length > this.config.maxEventHistory) {
      this.eventHistory.shift();
    }

    // 通知监听器
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener.onGameEvent(event);
        } catch (error) {
          console.error(`GameManager: 事件监听器执行错误:`, error);
        }
      });
    }
  }

  /**
   * 获取当前游戏状态
   */
  public getCurrentState(): GameState {
    return this.currentState;
  }

  /**
   * 检查游戏是否正在运行
   */
  public isRunning(): boolean {
    return this.currentState === GameState.RUNNING;
  }

  /**
   * 检查游戏是否暂停
   */
  public isPaused(): boolean {
    return this.currentState === GameState.PAUSED;
  }

  /**
   * 获取游戏配置
   */
  public getConfig() {
    return { ...this.config };
  }

  /**
   * 获取事件历史记录（用于调试）
   */
  public getEventHistory(): GameEvent[] {
    return [...this.eventHistory];
  }

  /**
   * 清空事件历史记录
   */
  public clearEventHistory(): void {
    this.eventHistory = [];
  }

  /**
   * 销毁游戏管理器（主要用于测试）
   */
  public destroy(): void {
    this.stopGame();
    this.eventListeners.clear();
    this.eventHistory = [];
    GameManager.instance = null as any;
  }

  /**
   * 获取游戏管理器状态信息（用于调试）
   */
  public getDebugInfo() {
    return {
      currentState: this.currentState,
      isRunning: this.isRunning(),
      eventListenersCount: this.eventListeners.size,
      eventHistoryCount: this.eventHistory.length,
      gameLoopActive: this.gameLoopId !== null,
    };
  }
}

// ===== 统一导出模块接口 =====

/**
 * 导出游戏管理器类和相关类型
 * 这是本模块对外提供的完整 API
 */
export {
  // 主要类
  GameManager,

  // 类型定义
  type GameEvent,
  type GameEventListener,

  // 枚举
  GameState,
};

/**
 * 导出便捷函数 - 获取游戏管理器实例
 * 这是推荐的使用方式，避免直接调用 GameManager.getInstance()
 */
export const getGameManager = () => GameManager.getInstance();
