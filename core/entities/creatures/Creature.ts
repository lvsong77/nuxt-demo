import { BaseEntity } from "../base/BaseEntity";

export abstract class Creature extends BaseEntity {
  _gender: string;

  constructor({
    id,
    name,
    description,
    gender,
  }: {
    id: string;
    name: string;
    description: string;
    gender: string;
  }) {
    super(id, name, description);
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