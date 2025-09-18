import { BaseEntity } from "./BaseEntity";
import { PlayerCharacter } from "./PlayerCharacter";
import { CreateCharacterData } from "../types/CharacterTypes";

/**
 * 游戏设置接口
 */
export interface GameSettings {
  // 音频设置
  audio: {
    masterVolume: number; // 主音量 (0-1)
    musicVolume: number; // 音乐音量 (0-1)
    soundEffectVolume: number; // 音效音量 (0-1)
    muted: boolean; // 是否静音
  };

  // 图形设置
  graphics: {
    quality: "low" | "medium" | "high";
    showFPS: boolean;
    enableParticles: boolean;
  };

  // 界面设置
  ui: {
    showTutorials: boolean;
    autoSave: boolean;
    autoSaveInterval: number; // 自动保存间隔（分钟）
  };

  // 游戏玩法设置
  gameplay: {
    pauseWhenInactive: boolean;
    showDamageNumbers: boolean;
    enableNotifications: boolean;
  };
}

/**
 * 游戏统计数据
 */
export interface GameStatistics {
  // 时间统计
  totalPlayTime: number; // 总游戏时间（毫秒）
  currentSessionTime: number; // 当前会话时间（毫秒）
  sessionStartTime: Date; // 会话开始时间

  // 游戏行为统计
  charactersCreated: number; // 创建的角色数量
  totalDeaths: number; // 总死亡次数
  totalLevelsGained: number; // 总升级次数
  totalExperienceGained: number; // 总获得经验值

  // 其他统计
  gamesStarted: number; // 游戏启动次数
  lastPlayDate: Date; // 最后游戏日期
}

/**
 * 存档摘要信息（用于存档列表显示）
 */
export interface SaveSummary {
  id: string;
  playerName: string;
  characterClass: string;
  characterLevel: number;
  totalPlayTime: number;
  createdAt: Date;
  lastPlayedAt: Date;
  mapId: string;
}

/**
 * 游戏存档类
 * 管理完整的游戏状态，包括角色、设置、统计等所有数据
 *
 * 职责：
 * - 管理玩家角色数据
 * - 保存游戏设置和偏好
 * - 记录游戏统计信息
 * - 提供存档的序列化和反序列化
 * - 管理存档的生命周期
 */
export class GameSave extends BaseEntity {
  // 核心游戏数据
  private _character: PlayerCharacter;
  private _playerName: string; // 用于显示的玩家名称（可能与角色名不同）

  // 游戏设置
  private _gameSettings: GameSettings;

  // 统计数据
  private _statistics: GameStatistics;

  // 存档元数据
  private _version: string = "1.0.0"; // 存档版本，用于数据迁移
  private _lastPlayedAt: Date;

  constructor(
    id: string,
    name: string,
    character: PlayerCharacter,
    description: string = ""
  ) {
    super(id, name, description);

    this._character = character;
    this._playerName = character.name;
    this._lastPlayedAt = new Date();

    // 初始化默认设置
    this._gameSettings = this.createDefaultSettings();

    // 初始化统计数据
    this._statistics = this.createInitialStatistics();

    console.log(`创建了新的游戏存档: ${name}`);
  }

  /**
   * 创建新的游戏存档
   */
  static createNew(characterData: CreateCharacterData): GameSave {
    const character = PlayerCharacter.createNew(characterData);
    const saveId = `save_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const saveName = `${characterData.name}的冒险`;

    return new GameSave(
      saveId,
      saveName,
      character,
      `${characterData.name}的游戏存档`
    );
  }

  // === Getter 方法 ===

  get character(): PlayerCharacter {
    return this._character;
  }

  get playerName(): string {
    return this._playerName;
  }

  get gameSettings(): GameSettings {
    return JSON.parse(JSON.stringify(this._gameSettings)); // 深拷贝
  }

  get statistics(): GameStatistics {
    return JSON.parse(JSON.stringify(this._statistics)); // 深拷贝
  }

  get version(): string {
    return this._version;
  }

  get lastPlayedAt(): Date {
    return new Date(this._lastPlayedAt);
  }

  // === 设置管理 ===

  /**
   * 更新游戏设置
   */
  updateGameSettings(newSettings: Partial<GameSettings>): void {
    this._gameSettings = {
      ...this._gameSettings,
      ...newSettings,
      // 深度合并嵌套对象
      audio: { ...this._gameSettings.audio, ...newSettings.audio },
      graphics: { ...this._gameSettings.graphics, ...newSettings.graphics },
      ui: { ...this._gameSettings.ui, ...newSettings.ui },
      gameplay: { ...this._gameSettings.gameplay, ...newSettings.gameplay },
    };

    this.updateTimestamp();
    console.log("游戏设置已更新");
  }

  /**
   * 重置设置为默认值
   */
  resetSettingsToDefault(): void {
    this._gameSettings = this.createDefaultSettings();
    this.updateTimestamp();
    console.log("游戏设置已重置为默认值");
  }

  // === 统计数据管理 ===

  /**
   * 开始新的游戏会话
   */
  startGameSession(): void {
    this._statistics.sessionStartTime = new Date();
    this._statistics.currentSessionTime = 0;
    this._statistics.gamesStarted++;
    this._lastPlayedAt = new Date();

    console.log("开始新的游戏会话");
  }

  /**
   * 结束游戏会话
   */
  endGameSession(): void {
    const sessionDuration =
      Date.now() - this._statistics.sessionStartTime.getTime();
    this._statistics.currentSessionTime = sessionDuration;
    this._statistics.totalPlayTime += sessionDuration;
    this._statistics.lastPlayDate = new Date();
    this._lastPlayedAt = new Date();

    this.updateTimestamp();
    console.log(
      `游戏会话结束，本次游戏时长: ${Math.round(
        sessionDuration / 1000 / 60
      )} 分钟`
    );
  }

  /**
   * 更新统计数据
   */
  updateStatistics(updates: Partial<GameStatistics>): void {
    Object.assign(this._statistics, updates);
    this.updateTimestamp();
  }

  /**
   * 记录角色升级
   */
  recordLevelUp(): void {
    this._statistics.totalLevelsGained++;
    this.updateTimestamp();
  }

  /**
   * 记录角色死亡
   */
  recordDeath(): void {
    this._statistics.totalDeaths++;
    this.updateTimestamp();
  }

  /**
   * 记录获得经验值
   */
  recordExperienceGained(amount: number): void {
    this._statistics.totalExperienceGained += amount;
    this.updateTimestamp();
  }

  // === 存档操作 ===

  /**
   * 获取存档摘要信息
   */
  getSummary(): SaveSummary {
    return {
      id: this.id,
      playerName: this._playerName,
      characterClass: this._character.classInfo.name,
      characterLevel: this._character.level,
      totalPlayTime: this._statistics.totalPlayTime,
      createdAt: this.createdAt,
      lastPlayedAt: this._lastPlayedAt,
      mapId: this._character.currentArea,
    };
  }

  /**
   * 更新最后游戏时间
   */
  updateLastPlayedTime(): void {
    this._lastPlayedAt = new Date();
    this.updateTimestamp();
  }

  // === 私有辅助方法 ===

  /**
   * 创建默认游戏设置
   */
  private createDefaultSettings(): GameSettings {
    return {
      audio: {
        masterVolume: 0.8,
        musicVolume: 0.7,
        soundEffectVolume: 0.8,
        muted: false,
      },
      graphics: {
        quality: "medium",
        showFPS: false,
        enableParticles: true,
      },
      ui: {
        showTutorials: true,
        autoSave: true,
        autoSaveInterval: 5, // 5分钟
      },
      gameplay: {
        pauseWhenInactive: true,
        showDamageNumbers: true,
        enableNotifications: true,
      },
    };
  }

  /**
   * 创建初始统计数据
   */
  private createInitialStatistics(): GameStatistics {
    return {
      totalPlayTime: 0,
      currentSessionTime: 0,
      sessionStartTime: new Date(),
      charactersCreated: 1, // 创建存档时就有一个角色
      totalDeaths: 0,
      totalLevelsGained: 0,
      totalExperienceGained: 0,
      gamesStarted: 0,
      lastPlayDate: new Date(),
    };
  }

  // === 序列化方法 ===

  /**
   * 序列化存档数据
   */
  public serialize(): Record<string, any> {
    return {
      ...super.serialize(),
      character: this._character.serialize(),
      playerName: this._playerName,
      gameSettings: this._gameSettings,
      statistics: {
        ...this._statistics,
        sessionStartTime: this._statistics.sessionStartTime.toISOString(),
        lastPlayDate: this._statistics.lastPlayDate.toISOString(),
      },
      version: this._version,
      lastPlayedAt: this._lastPlayedAt.toISOString(),
    };
  }

  /**
   * 从序列化数据恢复存档
   */
  public static deserialize(data: Record<string, any>): GameSave {
    const character = PlayerCharacter.deserialize(data.character);
    const save = new GameSave(data.id, data.name, character, data.description);

    // 恢复数据
    save._playerName = data.playerName;
    save._gameSettings = data.gameSettings;
    save._statistics = {
      ...data.statistics,
      sessionStartTime: new Date(data.statistics.sessionStartTime),
      lastPlayDate: new Date(data.statistics.lastPlayDate),
    };
    save._version = data.version;
    save._lastPlayedAt = new Date(data.lastPlayedAt);
    save.updatedAt = new Date(data.updatedAt);

    return save;
  }

  /**
   * 导出存档数据（用于备份或分享）
   */
  public exportSave(): string {
    const data = this.serialize();
    return JSON.stringify(data, null, 2);
  }

  /**
   * 从导出的数据导入存档
   */
  public static importSave(jsonString: string): GameSave {
    try {
      const data = JSON.parse(jsonString);
      return GameSave.deserialize(data);
    } catch (error) {
      throw new Error(`导入存档失败: ${error.message}`);
    }
  }

  /**
   * 获取存档的详细信息（用于调试）
   */
  public getDetailedInfo(): Record<string, any> {
    return {
      ...this.getInfo(),
      playerName: this._playerName,
      character: this._character.getDetailedInfo(),
      settings: this._gameSettings,
      statistics: this._statistics,
      version: this._version,
      lastPlayedAt: this._lastPlayedAt.toISOString(),
    };
  }

  /**
   * 验证存档数据完整性
   */
  public validateSave(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this._character) {
      errors.push("缺少角色数据");
    }

    if (!this._playerName || this._playerName.trim().length === 0) {
      errors.push("玩家名称无效");
    }

    if (!this._gameSettings) {
      errors.push("缺少游戏设置");
    }

    if (!this._statistics) {
      errors.push("缺少统计数据");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
