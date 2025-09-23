import type { IGameStorage } from "~~/core/interfaces/IGameStorage";
import { gameDB } from "~~/core/database/GameDB";

export class IndexedDBGameStorage implements IGameStorage {
  async getCharacter(id: string): Promise<any | null> {
    const data = await gameDB.characters.get(id);
    return data
      ? {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        }
      : null;
  }

  async saveCharacter(character: any): Promise<void> {
    await gameDB.characters.add({
      ...character,
      createdAt: character.createdAt.toISOString(),
      updatedAt: character.updatedAt.toISOString(),
    });
  }

  async updateCharacter(id: string, updates: any): Promise<void> {
    await gameDB.characters.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async deleteCharacter(id: string): Promise<void> {
    await gameDB.characters.delete(id);
  }

  async getAllCharacterSummaries(): Promise<{ id: string; name: string }[]> {
    const summaries: { id: string; name: string }[] = [];
    await gameDB.characters.each((character) => {
      summaries.push({
        id: character.id,
        name: character.name,
      });
    });
    return summaries;
  }

  async getMetadata(key: string): Promise<any> {
    const result = await gameDB.metadata.get(key);
    return result?.value;
  }

  async setMetadata(key: string, value: any): Promise<void> {
    await gameDB.metadata.put({
      key,
      value,
      updatedAt: new Date().toISOString(),
    });
  }

  async exportAllData(): Promise<string> {
    const characters = await gameDB.characters.toArray();
    const metadata = await gameDB.metadata.toArray();

    return JSON.stringify(
      {
        characters,
        metadata,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      },
      null,
      2
    );
  }

  async importAllData(data: string): Promise<void> {
    const parsed = JSON.parse(data);
    await gameDB.characters.clear();
    await gameDB.metadata.clear();
    await gameDB.characters.bulkAdd(parsed.characters);
    await gameDB.metadata.bulkAdd(parsed.metadata);
  }

  async clearAllData(): Promise<void> {
    await gameDB.characters.clear();
    await gameDB.metadata.clear();
  }
}
