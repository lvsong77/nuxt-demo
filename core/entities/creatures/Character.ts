import { Creature } from "./Creature";
import { v4 as uuidv4 } from "uuid";

export class Character extends Creature {
  constructor({
    name,
    gender,
    description,
    createdAt,
    updatedAt,
  }: {
    name: string;
    description?: string;
    gender: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    super({
      id: "character_" + uuidv4(),
      name,
      description: description ?? "",
      gender,
      createdAt,
      updatedAt,
    });
  }

  static override fromJSON(data: any): Character {
    return new Character({
      name: data.name,
      gender: data.gender,
      description: data.description,
      createdAt: new Date(data.createdAt), // 转换回 Date 对象
      updatedAt: new Date(data.updatedAt),
    });
  }
}
