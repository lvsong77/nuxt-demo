/**
 * 实体类模块的统一导出
 * 提供游戏中使用的所有实体类
 */

// 基础实体
export { BaseEntity } from "./BaseEntity";

// 世界对象
export { WorldObject } from "./WorldObject";

// 角色相关
export { PlayerCharacter } from "./PlayerCharacter";

// 存档系统
export {
  GameSave,
  type GameSettings,
  type GameStatistics,
  type SaveSummary,
} from "./GameSave";

// 可以在这里添加其他实体类的导出
// export { Item } from "./Item";
// export { Quest } from "./Quest";
// export { Skill } from "./Skill";
