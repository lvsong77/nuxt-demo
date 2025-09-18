class SaveManager {
  saveData: string;

  constructor() {
    this.saveData = "";
  }

  getSaveData() {
    return this.saveData;
  }

  setSaveData(data: string) {
    this.saveData = data;
  }
}

export { SaveManager };
