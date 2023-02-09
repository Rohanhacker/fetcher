import { MetaData } from "../models/MetaData.js"

export class DBService {
  /**
   * save metadata to db and update if url already exists
   * @param {*} pagesMetaData
   * @returns
   */
  async saveToDB(pagesMetaData) {
    const metaData = await MetaData.bulkCreate(pagesMetaData, {
      updateOnDuplicate: ["links", "images", "updatedAt"],
    })

    return metaData
  }

  /**
   * query db to get metadata
   * @param {string} url 
   * @returns 
   */
  async getMetaData(url) {
    return await MetaData.findAll({
      where: {
        url,
      },
    })
  }
}
