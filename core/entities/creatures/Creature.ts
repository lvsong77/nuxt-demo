import { BaseEntity } from "../base/BaseEntity";

export abstract class Creature extends BaseEntity {
  _gender: string;

  constructor({
    id,
    name,
    description,
    gender,
    createdAt,
    updatedAt,
  }: {
    id: string;
    name: string;
    description: string;
    gender: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super({
      id,
      name,
      description,
      createdAt,
      updatedAt,
    });
    this._gender = gender;
  }

  override toJSON(): any {
    return {
      ...super.toJSON(),
      gender: this._gender,
    };
  }

  static override fromJSON(data: any): Creature {
    throw new Error("fromJSON 方法需要在子类中实现");
  }
}
