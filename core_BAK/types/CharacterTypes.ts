/**
 * 角色职业枚举
 */
export enum CharacterClass {
  WARRIOR = "warrior",
  MAGE = "mage",
  ARCHER = "archer",
  ROGUE = "rogue",
}

/**
 * 角色职业信息
 */
export interface CharacterClassInfo {
  id: CharacterClass;
  name: string;
  description: string;
  baseHealth: number;
  baseMana: number;
  baseStrength: number;
  baseAgility: number;
  baseIntelligence: number;
  baseConstitution: number;
}

/**
 * 角色基础属性
 */
export interface CharacterAttributes {
  strength: number; // 力量 - 影响物理攻击力
  agility: number; // 敏捷 - 影响攻击速度和闪避
  intelligence: number; // 智力 - 影响魔法攻击力和魔法值
  constitution: number; // 体质 - 影响生命值
}

/**
 * 角色战斗状态
 */
export interface CharacterCombatStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;

  // 计算得出的战斗属性
  physicalAttack: number; // 物理攻击力
  magicalAttack: number; // 魔法攻击力
  defense: number; // 防御力
  magicDefense: number; // 魔法防御力
  attackSpeed: number; // 攻击速度
  criticalRate: number; // 暴击率
  dodgeRate: number; // 闪避率
}

/**
 * 技能类型枚举
 */
export enum SkillType {
  // 采集技能
  MINING = "mining", // 挖矿
  WOODCUTTING = "woodcutting", // 伐木
  FISHING = "fishing", // 钓鱼
  GATHERING = "gathering", // 采集

  // 制作技能
  SMITHING = "smithing", // 锻造
  COOKING = "cooking", // 烹饪
  ALCHEMY = "alchemy", // 炼金
  CRAFTING = "crafting", // 制作

  // 战斗技能
  MELEE_COMBAT = "melee_combat", // 近战
  RANGED_COMBAT = "ranged_combat", // 远程
  MAGIC_COMBAT = "magic_combat", // 魔法
  DEFENSE = "defense", // 防御
}

/**
 * 单个技能的等级信息
 */
export interface SkillLevel {
  skillType: SkillType;
  currentLevel: number;
  currentExperience: number;
  experienceToNextLevel: number;
  totalExperience: number;
}

/**
 * 角色的总体等级信息
 */
export interface CharacterLevel {
  totalLevel: number; // 所有技能等级之和
  averageLevel: number; // 平均技能等级
  highestSkillLevel: number; // 最高技能等级
  skillLevels: Map<SkillType, SkillLevel>; // 各技能的等级信息
}

/**
 * 创建角色时的数据
 */
export interface CreateCharacterData {
  name: string;
  class: CharacterClass;
  description?: string;
}

/**
 * 角色状态效果类型
 */
export enum StatusEffectType {
  BUFF = "buff", // 增益效果
  DEBUFF = "debuff", // 减益效果
  NEUTRAL = "neutral", // 中性效果
}

/**
 * 角色状态效果
 */
export interface StatusEffect {
  id: string;
  name: string;
  type: StatusEffectType;
  description: string;
  duration: number; // 持续时间（毫秒）
  remainingTime: number; // 剩余时间（毫秒）
  stackCount: number; // 叠加层数
  maxStack: number; // 最大叠加层数

  // 效果数值
  effects: {
    [key: string]: number; // 属性名 -> 数值变化
  };
}

/**
 * 预定义的角色职业配置
 */
export const CHARACTER_CLASS_CONFIGS: Record<
  CharacterClass,
  CharacterClassInfo
> = {
  [CharacterClass.WARRIOR]: {
    id: CharacterClass.WARRIOR,
    name: "战士",
    description: "近战物理职业，拥有高生命值和防御力",
    baseHealth: 120,
    baseMana: 50,
    baseStrength: 15,
    baseAgility: 8,
    baseIntelligence: 5,
    baseConstitution: 12,
  },
  [CharacterClass.MAGE]: {
    id: CharacterClass.MAGE,
    name: "法师",
    description: "远程魔法职业，拥有高魔法攻击力和魔法值",
    baseHealth: 80,
    baseMana: 120,
    baseStrength: 5,
    baseAgility: 6,
    baseIntelligence: 15,
    baseConstitution: 8,
  },
  [CharacterClass.ARCHER]: {
    id: CharacterClass.ARCHER,
    name: "弓箭手",
    description: "远程物理职业，拥有高敏捷和攻击速度",
    baseHealth: 100,
    baseMana: 70,
    baseStrength: 10,
    baseAgility: 15,
    baseIntelligence: 8,
    baseConstitution: 10,
  },
  [CharacterClass.ROGUE]: {
    id: CharacterClass.ROGUE,
    name: "盗贼",
    description: "敏捷型职业，拥有高暴击率和闪避率",
    baseHealth: 90,
    baseMana: 80,
    baseStrength: 12,
    baseAgility: 14,
    baseIntelligence: 9,
    baseConstitution: 9,
  },
};

/**
 * 经验值计算公式
 */
export class ExperienceCalculator {
  /**
   * 计算指定等级升到下一级需要的经验值
   */
  static getExperienceForLevel(level: number): number {
    if (level <= 1) return 0;

    // 使用指数增长公式：baseExp * level^1.5
    const baseExp = 100;
    return Math.floor(baseExp * Math.pow(level, 1.5));
  }

  /**
   * 计算从1级到指定等级需要的总经验值
   */
  static getTotalExperienceForLevel(level: number): number {
    let totalExp = 0;
    for (let i = 2; i <= level; i++) {
      totalExp += this.getExperienceForLevel(i);
    }
    return totalExp;
  }

  /**
   * 根据总经验值计算技能等级信息
   */
  static getSkillLevelFromExperience(
    skillType: SkillType,
    totalExp: number
  ): SkillLevel {
    let currentLevel = 1;
    let expUsed = 0;

    while (true) {
      const expForNextLevel = this.getExperienceForLevel(currentLevel + 1);
      if (expUsed + expForNextLevel > totalExp) {
        break;
      }
      expUsed += expForNextLevel;
      currentLevel++;
    }

    const currentExperience = totalExp - expUsed;
    const experienceToNextLevel =
      this.getExperienceForLevel(currentLevel + 1) - currentExperience;

    return {
      skillType,
      currentLevel,
      currentExperience,
      experienceToNextLevel,
      totalExperience: totalExp,
    };
  }

  /**
   * 计算角色的总体等级信息
   */
  static calculateCharacterLevel(
    skillLevels: Map<SkillType, SkillLevel>
  ): CharacterLevel {
    const levels = Array.from(skillLevels.values()).map(
      (skill) => skill.currentLevel
    );

    const totalLevel = levels.reduce((sum, level) => sum + level, 0);
    const averageLevel = levels.length > 0 ? totalLevel / levels.length : 0;
    const highestSkillLevel = levels.length > 0 ? Math.max(...levels) : 0;

    return {
      totalLevel,
      averageLevel: Math.round(averageLevel * 100) / 100, // 保留两位小数
      highestSkillLevel,
      skillLevels,
    };
  }
}
