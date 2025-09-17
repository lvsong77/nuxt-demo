/**
 * 类型定义模块的统一导出
 * 提供游戏中使用的所有类型定义
 */

// 角色相关类型
export {
  CharacterClass,
  type CharacterClassInfo,
  type CharacterAttributes,
  type CharacterCombatStats,
  type CharacterLevel,
  type CreateCharacterData,
  StatusEffectType,
  type StatusEffect,
  CHARACTER_CLASS_CONFIGS,
  ExperienceCalculator,
  SkillType,
  type SkillLevel,
} from "./CharacterTypes";

// 可以在这里添加其他类型模块的导出
// export * from "./ItemTypes";
// export * from "./QuestTypes";
// export * from "./SkillTypes";
