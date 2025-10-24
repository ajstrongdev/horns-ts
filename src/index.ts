import { run, handle } from "@oclif/core";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = resolve(__dirname);

await run(process.argv.slice(2), { root }).catch(handle);
