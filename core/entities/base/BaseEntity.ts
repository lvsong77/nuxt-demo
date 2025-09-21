/**
 * 所有游戏对象的基类
 * 提供所有游戏实体的基础属性和方法
 */

export abstract class BaseEntity {
  _id: string;
  _name: string;
  _description: string;
  _createdAt: Date;
  _updatedAt: Date;

  constructor(id: string, name: string, description: string = "") {
    this._id = id;
    this._name = name;
    this._description = description;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }
  
  toJSON(): any {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
  
  static fromJSON(data: any): BaseEntity {
    throw new Error("fromJSON 方法需要在子类中实现");
  }
}
