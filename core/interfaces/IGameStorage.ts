export interface IGameStorage {
  // 角色存储
  getCharacter(id: string): Promise<any | null>;
  saveCharacter(character: any): Promise<void>;
  updateCharacter(id: string, updates: any): Promise<void>;
  deleteCharacter(id: string): Promise<void>;
  getAllCharacterSummaries(): Promise<{ id: string; name: string }[]>;

  // 元数据存储
  getMetadata(key: string): Promise<any>;
  setMetadata(key: string, value: any): Promise<void>;

  // 批量操作
  exportAllData(): Promise<string>;
  importAllData(data: string): Promise<void>;
  clearAllData(): Promise<void>;
}
