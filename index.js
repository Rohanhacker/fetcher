import { FetchCli } from "./fetchCli.js";

const cli = new FetchCli()

cli.run(process.argv.slice(2))

