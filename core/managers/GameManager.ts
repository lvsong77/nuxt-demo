import { SaveManager } from "./SaveManager";
import { Character } from "~~/core/entities/creatures/Character";

interface SaveData {
  characters: Character[];
  currentCharacterId: string;
}
class GameManager {
  _characters: Character[];
  _currentCharacterId: string;

  constructor() {
    this._characters = [];
    this._currentCharacterId = '';
    this.initialize();
  }

  private initialize() {
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
    this._characters = parsedData.characters ?? [];
    this._currentCharacterId = parsedData.currentCharacterId ?? '';
  }

  createCharacter(data: {
    name: string;
    gender: string;
  }) {
    const character = new Character({
      name: data.name,
      gender: data.gender,
      description: '',
    });
    this._characters.push(character);
    this.selectCharacter(character.id);
  }

  selectCharacter(characterId: string) {
    this._currentCharacterId = characterId;
  }
}

type GameManagerType = GameManager;

export { GameManager };
export type { GameManagerType };
