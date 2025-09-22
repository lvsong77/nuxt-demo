import { gameDB } from "~/core/database/GameDB";
import { Character } from "~/core/entities/creatures/Character";

interface SaveData {
  characters: Character[];
  currentCharacterId: string;
}
class GameManager {
  _characters: Character[];
  _currentCharacterId: string;

  // 缓存
  private characterCache = new Map<string, Character>();

  constructor() {
    this._characters = [];
    this._currentCharacterId = "";
    this.initialize();
  }

  private async initialize() {
    // 从数据库加载元数据
    const metadata = await gameDB.metadata.get("currentCharacterId");
    this._currentCharacterId = metadata?.value || "";

    console.log("GameManager initialized");
  }

  get characters() {
    return this._characters;
  }

  get currentCharacterId() {
    return this._currentCharacterId;
  }

  save() {
    const saveData: SaveData = {
      characters: this._characters,
      currentCharacterId: this._currentCharacterId,
    };
    return JSON.stringify(saveData);
  }

  load(data: string) {
    const parsedData = JSON.parse(data) as SaveData;

    this._characters = (parsedData.characters ?? []).map((character) =>
      Character.fromJSON(character)
    );
    this._currentCharacterId = parsedData.currentCharacterId ?? "";
  }

  createCharacter(data: { name: string; gender: string }) {
    const character = new Character({
      name: data.name,
      gender: data.gender,
      description: "",
    });
    this._characters.push(character);
    this.selectCharacter(character.id);
  }

  selectCharacter(characterId: string) {
    this._currentCharacterId = characterId;
  }

  async getCharacterList() {
    return await gameDB.characters.each((character) => {
      return {
        id: character.id,
        name: character.name,
      };
    });
  }
}

type GameManagerType = GameManager;

export { GameManager };
export type { GameManagerType };
