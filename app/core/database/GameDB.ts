import Dexie, { type Table } from "dexie";

export interface CharacterData {
  id: string;
  name: string;
  description: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameMetadata {
  key: string;
  value: any;
  updatedAt: string;
}

export class GameDB extends Dexie {
  characters!: Table<CharacterData>;
  metadata!: Table<GameMetadata>;

  constructor() {
    super("GameDatabase");
    this.version(1).stores({
      characters: "id, name, gender, description, createdAt, updatedAt",
      metadata: "key, updatedAt",
    });
  }
}

export const gameDB = new GameDB();
