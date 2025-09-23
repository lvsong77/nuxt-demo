import type { IGameStorage } from "../interfaces/IGameStorage";
import { Character } from "../entities/creatures/Character";

export class GameManager {
  private characterCache = new Map<string, Character>();
  private _currentCharacterId = "";
  private _initialized = false;
  private _initPromise: Promise<void>;

  constructor(private storage: IGameStorage) {
    this._initPromise = this.initialize();
  }

  private async initialize() {
    const currentId = await this.storage.getMetadata("currentCharacterId");
    this._currentCharacterId = currentId || "";
    this._initialized = true;
  }

  async waitForInitialization(): Promise<void> {
    await this._initPromise;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  async getCharacterList(): Promise<Character[]> {
    await this.waitForInitialization();

    // LVTODO: 这里不应该从cache中获取，待修改
    return Array.from(this.characterCache.values());
  }

  async getCharacter(id: string): Promise<Character | null> {
    await this.waitForInitialization();

    if (this.characterCache.has(id)) {
      return this.characterCache.get(id)!;
    }

    const data = await this.storage.getCharacter(id);
    if (data) {
      const character = Character.fromJSON(data);
      this.characterCache.set(id, character);
      return character;
    }

    return null;
  }

  async createCharacter(data: { name: string; gender: string }) {
    await this.waitForInitialization();

    const now = new Date();
    const character = new Character({
      name: data.name,
      gender: data.gender,
      description: "",
      createdAt: now,
      updatedAt: now,
    });

    await this.storage.saveCharacter(character.toJSON());
    this.characterCache.set(character.id, character);
    await this.selectCharacter(character.id);

    return character;
  }

  async selectCharacter(characterId: string) {
    await this.waitForInitialization();

    this._currentCharacterId = characterId;
    await this.storage.setMetadata("currentCharacterId", characterId);
  }
}
