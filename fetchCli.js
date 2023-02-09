import yargs from "yargs"
import fetch from "node-fetch"
import { MetaData } from "./models/MetaData.js"
import { DBService } from "./services/dbService.js"
import { FileService } from "./services/fileService.js"
import { ParseService } from "./services/parseService.js"

export class FetchCli {
  constructor() {
    this.initDB()
    this.dbService = new DBService()
    this.fileService = new FileService()
    this.parseService = new ParseService()
  }

  /**
   * init the db and create table if doesn't exists
   */
  async initDB() {
    await MetaData.sync()
  }

  async run(args) {
    const parsedArgs = yargs(args).argv
    if (parsedArgs.metadata) {
      try {
        const data = await this.dbService.getMetaData(parsedArgs.metadata)
        if (!data || data.length == 0) {
          throw new Error("not available")
        }
        const values = data[0].dataValues
        const date = new Date(values.updatedAt)
        console.log(`site: ${values.url}`)
        console.log(`num_links: ${values.links}`)
        console.log(`images: ${values.images}`)
        console.log(`last_fetch: ${date.toUTCString()}`)
      } catch (e) {
        if (e.message === "not available") {
          console.error("Metadata not available for the given url")
        } else {
          console.error("Unknown Error")
        }
      }
      return
    }
    const urls = parsedArgs._
    this.fetchPages(urls)
  }

  /**
   * fetch pages and print if any error is caught
   * Fetch valid urls and show error for invalid urls
   * @param {*} urls 
   */
  async fetchPages(urls) {
    try {
      const fetchedPages = await Promise.allSettled(
        urls.map(async (url) => {
          const resp = await fetch(url)
          const text = await resp.text()
          return { source: text, url }
        })
      );
      const fullfilledPages = fetchedPages
        .filter((page) => page.status === "fulfilled")
        .map((page) => page.value)
      const rejectedPages = fetchedPages.filter(
        (page) => page.status === "rejected"
      )
      rejectedPages.forEach((page) => {
        console.error(
          `can't fetch url ${page.reason.input} error: ${page.reason.code}`
        )
      })

      const parsedMetaData = this.parseService.parseMetaData(fullfilledPages)
      this.dbService.saveToDB(parsedMetaData)
      this.fileService.saveToDisk(fullfilledPages)
    } catch (e) {
      console.error("error fetching page ", e.message)
    }
  }
}
