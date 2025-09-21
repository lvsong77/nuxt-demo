import { Creature } from "./Creature";
import { v4 as uuidv4 } from 'uuid';

export class Character extends Creature {
  constructor({
    name,
    gender,
    description,
  }: {
    name: string;
    description?: string;
    gender: string;
  }) {
    super({
      id: 'character_' + uuidv4(),
      name,
      description: description ?? "",
      gender,
    });
  }
}
