import { BaseEntity } from "./BaseEntity";

/**
 * 世界对象基类
 * 所有存在于游戏世界中的对象的基类
 *
 * 适用于纯文字游戏：
 * - 属于某个场景/区域
 * - 可以在场景间切换
 * - 记录当前位置信息
 */
export abstract class WorldObject extends BaseEntity {
  // 当前所在场景/区域ID
  protected _currentArea: string;

  // 场景内的具体位置描述（如"村庄中心"、"森林深处"等）
  protected _locationDescription: string;

  constructor(
    id: string,
    name: string,
    description: string = "",
    currentArea: string = "starting_village",
    locationDescription: string = "未知位置"
  ) {
    super(id, name, description);
    this._currentArea = currentArea;
    this._locationDescription = locationDescription;
  }

  /**
   * 获取当前区域ID
   */
  get currentArea(): string {
    return this._currentArea;
  }

  /**
   * 获取位置描述
   */
  get locationDescription(): string {
    return this._locationDescription;
  }

  /**
   * 获取完整的位置信息
   */
  get fullLocation(): string {
    return `${this._currentArea} - ${this._locationDescription}`;
  }

  /**
   * 移动到新的区域
   */
  moveToArea(
    newAreaId: string,
    newLocationDescription: string = "区域入口"
  ): void {
    const oldArea = this._currentArea;
    const oldLocation = this._locationDescription;

    this._currentArea = newAreaId;
    this._locationDescription = newLocationDescription;
    this.updateTimestamp();

    console.log(
      `${this.name} 从 ${oldArea}(${oldLocation}) 移动到 ${newAreaId}(${newLocationDescription})`
    );
  }

  /**
   * 在当前区域内移动到新位置
   */
  moveToLocation(newLocationDescription: string): void {
    const oldLocation = this._locationDescription;
    this._locationDescription = newLocationDescription;
    this.updateTimestamp();

    console.log(
      `${this.name} 在 ${this._currentArea} 内从 ${oldLocation} 移动到 ${newLocationDescription}`
    );
  }

  /**
   * 检查是否在同一区域
   */
  isInSameArea(other: WorldObject): boolean {
    return this._currentArea === other._currentArea;
  }

  /**
   * 检查是否在相同位置
   */
  isAtSameLocation(other: WorldObject): boolean {
    return (
      this.isInSameArea(other) &&
      this._locationDescription === other._locationDescription
    );
  }

  /**
   * 序列化世界对象数据
   */
  public serialize(): Record<string, any> {
    return {
      ...super.serialize(),
      currentArea: this._currentArea,
      locationDescription: this._locationDescription,
    };
  }

  /**
   * 从序列化数据恢复世界对象
   * 注意：子类应该重写此方法以正确处理自己的构造参数
   */
  public static deserialize(data: Record<string, any>): WorldObject {
    // 这是一个基础实现，子类应该重写
    throw new Error("WorldObject.deserialize() 应该被子类重写");
  }

  /**
   * 获取世界对象的调试信息
   */
  public getDebugInfo(): Record<string, any> {
    return {
      ...this.getInfo(),
      currentArea: this._currentArea,
      locationDescription: this._locationDescription,
      fullLocation: this.fullLocation,
    };
  }
}
