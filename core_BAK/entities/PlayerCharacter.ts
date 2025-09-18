import { WorldObject } from "./WorldObject";
import {
  CharacterClass,
  CharacterClassInfo,
  CharacterAttributes,
  CharacterCombatStats,
  CharacterLevel,
  CreateCharacterData,
  StatusEffect,
  CHARACTER_CLASS_CONFIGS,
  ExperienceCalculator,
  SkillType,
  SkillLevel,
} from "../types/CharacterTypes";

/**
 * 玩家角色类
 * 继承自WorldObject，代表玩家在游戏世界中的化身
 *
 * 主要功能：
 * - 角色属性管理（等级、经验、属性点）
 * - 战斗系统支持（生命值、魔法值、战斗属性）
 * - 状态效果管理
 * - 角色成长系统
 */
export class PlayerCharacter extends WorldObject {
  // 角色基础信息
  private _class: CharacterClass;
  private _classInfo: CharacterClassInfo;

  // 技能等级和经验（每个技能独立）
  private _skillLevels: Map<SkillType, SkillLevel> = new Map();
  private _levelInfo: CharacterLevel;

  // 基础属性
  private _baseAttributes: CharacterAttributes;
  private _bonusAttributes: CharacterAttributes; // 来自装备、技能等的加成

  // 战斗状态
  private _combatStats: CharacterCombatStats;

  // 状态效果
  private _statusEffects: Map<string, StatusEffect> = new Map();

  // 可分配的属性点
  private _availableAttributePoints: number = 0;

  constructor(
    id: string,
    name: string,
    characterClass: CharacterClass,
    description: string = "",
    currentArea: string = "starting_village",
    locationDescription: string = "新手村"
  ) {
    super(id, name, description, currentArea, locationDescription);

    this._class = characterClass;
    this._classInfo = CHARACTER_CLASS_CONFIGS[characterClass];

    // 初始化所有技能等级为1级
    this.initializeSkills();

    // 计算总体等级信息
    this._levelInfo = ExperienceCalculator.calculateCharacterLevel(
      this._skillLevels
    );

    // 初始化基础属性
    this._baseAttributes = {
      strength: this._classInfo.baseStrength,
      agility: this._classInfo.baseAgility,
      intelligence: this._classInfo.baseIntelligence,
      constitution: this._classInfo.baseConstitution,
    };

    // 初始化加成属性
    this._bonusAttributes = {
      strength: 0,
      agility: 0,
      intelligence: 0,
      constitution: 0,
    };

    // 计算初始战斗属性
    this._combatStats = this.calculateCombatStats();

    console.log(`创建了${this._classInfo.name}角色: ${name}`);
  }

  /**
   * 初始化所有技能为1级
   */
  private initializeSkills(): void {
    Object.values(SkillType).forEach((skillType) => {
      this._skillLevels.set(skillType, {
        skillType,
        currentLevel: 1,
        currentExperience: 0,
        experienceToNextLevel: ExperienceCalculator.getExperienceForLevel(2),
        totalExperience: 0,
      });
    });
  }

  /**
   * 从创建数据创建新角色
   */
  static createNew(data: CreateCharacterData): PlayerCharacter {
    const id = `player_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    return new PlayerCharacter(
      id,
      data.name,
      data.class,
      data.description || `一位${CHARACTER_CLASS_CONFIGS[data.class].name}`
    );
  }

  // === Getter 方法 ===

  get characterClass(): CharacterClass {
    return this._class;
  }

  get classInfo(): CharacterClassInfo {
    return { ...this._classInfo };
  }

  get level(): number {
    return this._levelInfo.totalLevel;
  }

  get levelInfo(): CharacterLevel {
    return { ...this._levelInfo };
  }

  get skillLevels(): Map<SkillType, SkillLevel> {
    return new Map(this._skillLevels);
  }

  /**
   * 获取指定技能的等级信息
   */
  getSkillLevel(skillType: SkillType): SkillLevel | undefined {
    return this._skillLevels.get(skillType);
  }

  get baseAttributes(): CharacterAttributes {
    return { ...this._baseAttributes };
  }

  get bonusAttributes(): CharacterAttributes {
    return { ...this._bonusAttributes };
  }

  get totalAttributes(): CharacterAttributes {
    return {
      strength: this._baseAttributes.strength + this._bonusAttributes.strength,
      agility: this._baseAttributes.agility + this._bonusAttributes.agility,
      intelligence:
        this._baseAttributes.intelligence + this._bonusAttributes.intelligence,
      constitution:
        this._baseAttributes.constitution + this._bonusAttributes.constitution,
    };
  }

  get combatStats(): CharacterCombatStats {
    return { ...this._combatStats };
  }

  get availableAttributePoints(): number {
    return this._availableAttributePoints;
  }

  get statusEffects(): StatusEffect[] {
    return Array.from(this._statusEffects.values());
  }

  // === 技能经验和等级系统 ===

  /**
   * 为指定技能获得经验值
   */
  gainSkillExperience(skillType: SkillType, amount: number): boolean {
    if (amount <= 0) return false;

    const skillLevel = this._skillLevels.get(skillType);
    if (!skillLevel) {
      console.warn(`技能 ${skillType} 不存在`);
      return false;
    }

    skillLevel.totalExperience += amount;
    skillLevel.currentExperience += amount;

    console.log(`${this.name} 的 ${skillType} 技能获得了 ${amount} 点经验值`);

    // 检查是否可以升级
    let leveledUp = false;
    while (skillLevel.currentExperience >= skillLevel.experienceToNextLevel) {
      leveledUp = this.skillLevelUp(skillType) || leveledUp;
    }

    // 重新计算总体等级信息
    this._levelInfo = ExperienceCalculator.calculateCharacterLevel(
      this._skillLevels
    );

    this.updateTimestamp();
    return leveledUp;
  }

  /**
   * 技能升级
   */
  private skillLevelUp(skillType: SkillType): boolean {
    const skillLevel = this._skillLevels.get(skillType);
    if (!skillLevel) return false;

    const expToNext = skillLevel.experienceToNextLevel;
    skillLevel.currentExperience -= expToNext;
    skillLevel.currentLevel++;
    skillLevel.experienceToNextLevel =
      ExperienceCalculator.getExperienceForLevel(skillLevel.currentLevel + 1);

    // 技能升级奖励
    this._availableAttributePoints += 2; // 每个技能升级获得2个属性点

    // 重新计算战斗属性（技能等级提升可能影响战斗属性）
    this._combatStats = this.calculateCombatStats();

    console.log(
      `🎉 ${this.name} 的 ${skillType} 技能升级到了 ${skillLevel.currentLevel} 级！`
    );
    console.log(
      `获得了 2 个属性点，当前可用属性点: ${this._availableAttributePoints}`
    );

    this.updateTimestamp();
    return true;
  }

  // === 属性系统 ===

  /**
   * 分配属性点
   */
  allocateAttributePoint(
    attribute: keyof CharacterAttributes,
    points: number = 1
  ): boolean {
    if (points <= 0 || points > this._availableAttributePoints) {
      console.warn(
        `无法分配 ${points} 个属性点，可用属性点: ${this._availableAttributePoints}`
      );
      return false;
    }

    this._baseAttributes[attribute] += points;
    this._availableAttributePoints -= points;

    // 重新计算战斗属性
    this._combatStats = this.calculateCombatStats();

    console.log(
      `${this.name} 分配了 ${points} 点${attribute}，当前${attribute}: ${this._baseAttributes[attribute]}`
    );
    this.updateTimestamp();
    return true;
  }

  /**
   * 计算战斗属性
   */
  private calculateCombatStats(): CharacterCombatStats {
    const totalAttrs = this.totalAttributes;
    const avgLevel = this._levelInfo.averageLevel;

    // 基础数值计算（使用平均技能等级）
    const maxHealth =
      this._classInfo.baseHealth +
      totalAttrs.constitution * 10 +
      Math.floor(avgLevel) * 5;
    const maxMana =
      this._classInfo.baseMana +
      totalAttrs.intelligence * 8 +
      Math.floor(avgLevel) * 3;

    // 保持当前生命值和魔法值的比例（如果不是初始化）
    let currentHealth = maxHealth;
    let currentMana = maxMana;

    if (this._combatStats) {
      const healthRatio =
        this._combatStats.health / this._combatStats.maxHealth;
      const manaRatio = this._combatStats.mana / this._combatStats.maxMana;
      currentHealth = Math.floor(maxHealth * healthRatio);
      currentMana = Math.floor(maxMana * manaRatio);
    }

    return {
      health: currentHealth,
      maxHealth: maxHealth,
      mana: currentMana,
      maxMana: maxMana,
      physicalAttack: totalAttrs.strength * 2 + Math.floor(avgLevel),
      magicalAttack: totalAttrs.intelligence * 2 + Math.floor(avgLevel),
      defense: totalAttrs.constitution + Math.floor(totalAttrs.strength * 0.5),
      magicDefense:
        totalAttrs.intelligence + Math.floor(totalAttrs.constitution * 0.5),
      attackSpeed: 100 + totalAttrs.agility,
      criticalRate: Math.min(50, totalAttrs.agility * 0.5), // 最大50%暴击率
      dodgeRate: Math.min(30, totalAttrs.agility * 0.3), // 最大30%闪避率
    };
  }

  // === 状态效果系统 ===

  /**
   * 添加状态效果
   */
  addStatusEffect(effect: StatusEffect): void {
    const existing = this._statusEffects.get(effect.id);

    if (existing) {
      // 如果已存在，更新叠加层数和持续时间
      existing.stackCount = Math.min(
        existing.maxStack,
        existing.stackCount + effect.stackCount
      );
      existing.remainingTime = Math.max(
        existing.remainingTime,
        effect.duration
      );
    } else {
      // 新增状态效果
      this._statusEffects.set(effect.id, {
        ...effect,
        remainingTime: effect.duration,
      });
    }

    console.log(`${this.name} 获得状态效果: ${effect.name}`);
    this.updateTimestamp();
  }

  /**
   * 移除状态效果
   */
  removeStatusEffect(effectId: string): boolean {
    const removed = this._statusEffects.delete(effectId);
    if (removed) {
      console.log(`${this.name} 失去状态效果: ${effectId}`);
      this.updateTimestamp();
    }
    return removed;
  }

  /**
   * 更新状态效果（减少持续时间）
   */
  updateStatusEffects(deltaTime: number): void {
    const expiredEffects: string[] = [];

    for (const [id, effect] of this._statusEffects) {
      effect.remainingTime -= deltaTime;
      if (effect.remainingTime <= 0) {
        expiredEffects.push(id);
      }
    }

    // 移除过期的状态效果
    expiredEffects.forEach((id) => this.removeStatusEffect(id));
  }

  // === 生命值和魔法值管理 ===

  /**
   * 恢复生命值
   */
  heal(amount: number): number {
    const oldHealth = this._combatStats.health;
    this._combatStats.health = Math.min(
      this._combatStats.maxHealth,
      this._combatStats.health + amount
    );
    const actualHealed = this._combatStats.health - oldHealth;

    if (actualHealed > 0) {
      console.log(`${this.name} 恢复了 ${actualHealed} 点生命值`);
      this.updateTimestamp();
    }

    return actualHealed;
  }

  /**
   * 消耗魔法值
   */
  consumeMana(amount: number): boolean {
    if (this._combatStats.mana >= amount) {
      this._combatStats.mana -= amount;
      console.log(`${this.name} 消耗了 ${amount} 点魔法值`);
      this.updateTimestamp();
      return true;
    }
    return false;
  }

  /**
   * 恢复魔法值
   */
  restoreMana(amount: number): number {
    const oldMana = this._combatStats.mana;
    this._combatStats.mana = Math.min(
      this._combatStats.maxMana,
      this._combatStats.mana + amount
    );
    const actualRestored = this._combatStats.mana - oldMana;

    if (actualRestored > 0) {
      console.log(`${this.name} 恢复了 ${actualRestored} 点魔法值`);
      this.updateTimestamp();
    }

    return actualRestored;
  }

  // === 序列化方法 ===

  /**
   * 序列化角色数据
   */
  public serialize(): Record<string, any> {
    // 将 Map 转换为普通对象进行序列化
    const skillLevelsObj: Record<string, SkillLevel> = {};
    this._skillLevels.forEach((value, key) => {
      skillLevelsObj[key] = value;
    });

    return {
      ...super.serialize(),
      class: this._class,
      skillLevels: skillLevelsObj,
      levelInfo: this._levelInfo,
      baseAttributes: this._baseAttributes,
      bonusAttributes: this._bonusAttributes,
      combatStats: this._combatStats,
      availableAttributePoints: this._availableAttributePoints,
      statusEffects: Array.from(this._statusEffects.values()),
    };
  }

  /**
   * 从序列化数据恢复角色
   */
  public static deserialize(data: Record<string, any>): PlayerCharacter {
    const character = new PlayerCharacter(
      data.id,
      data.name,
      data.class,
      data.description,
      data.currentArea,
      data.locationDescription
    );

    // 恢复技能等级数据
    if (data.skillLevels) {
      character._skillLevels.clear();
      Object.entries(data.skillLevels).forEach(([skillType, skillLevel]) => {
        character._skillLevels.set(
          skillType as SkillType,
          skillLevel as SkillLevel
        );
      });
    }

    // 恢复其他数据
    character._levelInfo = data.levelInfo;
    character._baseAttributes = data.baseAttributes;
    character._bonusAttributes = data.bonusAttributes;
    character._combatStats = data.combatStats;
    character._availableAttributePoints = data.availableAttributePoints;
    character.updatedAt = new Date(data.updatedAt);

    // 恢复状态效果
    if (data.statusEffects) {
      data.statusEffects.forEach((effect: StatusEffect) => {
        character._statusEffects.set(effect.id, effect);
      });
    }

    return character;
  }

  /**
   * 获取角色的详细信息（用于调试和UI显示）
   */
  public getDetailedInfo(): Record<string, any> {
    // 转换技能等级信息为可读格式
    const skillLevelsInfo: Record<string, any> = {};
    this._skillLevels.forEach((skillLevel, skillType) => {
      skillLevelsInfo[skillType] = {
        level: skillLevel.currentLevel,
        experience: `${skillLevel.currentExperience}/${skillLevel.experienceToNextLevel}`,
        totalExperience: skillLevel.totalExperience,
      };
    });

    return {
      ...this.getDebugInfo(),
      class: this._classInfo.name,
      totalLevel: this._levelInfo.totalLevel,
      averageLevel: this._levelInfo.averageLevel,
      highestSkillLevel: this._levelInfo.highestSkillLevel,
      skillLevels: skillLevelsInfo,
      attributes: this.totalAttributes,
      combatStats: this._combatStats,
      availableAttributePoints: this._availableAttributePoints,
      statusEffectsCount: this._statusEffects.size,
    };
  }
}
