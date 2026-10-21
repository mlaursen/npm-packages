export class ShikiCssFileCache {
  #fileName = "";

  set fileName(fileName) {
    this.#fileName = fileName;
  }

  get fileName() {
    return this.#fileName;
  }
}
