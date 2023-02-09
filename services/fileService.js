import fs from "fs"

export class FileService {
  /**
   * save pages html to disk
   * @param {*} pages
   */
  async saveToDisk(pages) {
    await Promise.all(
      pages.map(async (page) => {
        const pathToSave = `./${page.url.split("//")[1]}.html`
        return await fs.promises.writeFile(pathToSave, page.source, {
          flag: "a+",
        })
      })
    )
  }
}
