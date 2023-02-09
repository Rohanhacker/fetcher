import { parse } from "node-html-parser"

export class ParseService {
  parseMetaData(pages) {
    const pagesMetaData = pages.map((page) => {
      const root = parse(page.source)
      return {
        links: root.querySelectorAll("a").length,
        images: root.querySelectorAll("img").length,
        url: page.url,
      }
    })
    return pagesMetaData
  }
}
