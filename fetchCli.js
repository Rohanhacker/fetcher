import yargs from "yargs";
import fetch from "node-fetch";
import fs from "fs";
import { parse } from "node-html-parser";
import { MetaData } from "./models/MetaData.js";

export class FetchCli {
  constructor() {
    this.initDB();
  }
  async initDB() {
    await MetaData.sync();
  }

  async run(args) {
    const parsedArgs = yargs(args).argv;
    if (parsedArgs.metadata) {
      try {
        const data = await this.getMetaData(parsedArgs.metadata);
        if (!data || data.length == 0) {
          throw new Error("not available");
        }
        const values = data[0].dataValues;
        const date = new Date(values.updatedAt);
        console.log(`site: ${values.url}`);
        console.log(`num_links: ${values.links}`);
        console.log(`images: ${values.images}`);
        console.log(`last_fetch: ${date.toUTCString()}`);
      } catch (e) {
        if (e.message === "not available") {
          console.error("Metadata not available for the given url");
        } else {
          console.error("Unknown Error");
        }
      }
      return;
    }
    const urls = parsedArgs._;
    this.fetchPages(urls);
  }

  async getMetaData(url) {
    return await MetaData.findAll({
      where: {
        url,
      },
    });
  }

  async saveToDisk(pages) {
    await Promise.all(
      pages.map(async (page) => {
        const pathToSave = `./${page.url.split("//")[1]}.html`;
        return await fs.promises.writeFile(pathToSave, page.source, {
          flag: "a+",
        });
      })
    );
  }

  parseMetaData(pages) {
    const pagesMetaData = pages.map((page) => {
      const root = parse(page.source);
      return {
        links: root.querySelectorAll("a").length,
        images: root.querySelectorAll("img").length,
        url: page.url,
      };
    });
    return pagesMetaData;
  }

  async saveToDB(pagesMetaData) {
    const metaData = await MetaData.bulkCreate(pagesMetaData, {
      updateOnDuplicate: ["links", "images", "updatedAt"],
    });
    return metaData;
  }

  async fetchPages(urls) {
    try {
      const fetchedPages = await Promise.allSettled(
        urls.map(async (url) => {
          const resp = await fetch(url);
          const text = await resp.text();
          return { source: text, url };
        })
      );
      const fullfilledPages = fetchedPages.filter(page => page.status === "fulfilled").map(page => page.value)
      const rejectedPages = fetchedPages.filter(page => page.status === "rejected")
      rejectedPages.forEach(page => {
        console.error(`can't fetch url ${page.reason.input} error: ${page.reason.code}`)
      })

      const parsedMetaData = this.parseMetaData(fullfilledPages);
      this.saveToDB(parsedMetaData);
      this.saveToDisk(fullfilledPages);
    } catch (e) {
      console.error("error fetching page ", e.message);
    }
  }
}
