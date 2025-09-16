/**
 * 所有游戏对象的基类
 * 提供所有游戏实体的基础属性和方法
 */

export abstract class BaseEntity {
  public readonly id: string;
  public name: string;
  public description: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(id: string, name: string, description: string = "") {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * 更新实体的最后修改时间
   */
  protected updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  /**
   * 获取实体的基本信息
   */
  public getInfo(): {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * 序列化实体数据
   */
  public serialize(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * 从序列化数据恢复实体
   */
  public static deserialize<T extends BaseEntity>(
    this: new (id: string, name: string, description?: string) => T,
    data: Record<string, any>
  ): T {
    const entity = new this(data.id, data.name, data.description);
    entity.updatedAt = new Date(data.updatedAt);
    return entity;
  }
}
