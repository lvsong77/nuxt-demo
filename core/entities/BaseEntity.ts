/**
 * 所有游戏对象的基类
 * 提供所有游戏实体的基础属性和方法
 */

export abstract class BaseEntity {
  public id: string;
  public name: string;
  public description: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(id: string, name: string, description: string = "") {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
