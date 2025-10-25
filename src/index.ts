import { Config } from "@oclif/core";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import BackupCommand from "./commands/backup.js";
import { HELP_TEXT, VERSION } from "./utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  try {
    const args = process.argv.slice(2);
    const config = new Config({
      name: "horns",
      version: "1.0.0",
      root: resolve(__dirname),
      pjson: {
        name: "horns",
        version: "1.0.0",
        oclif: {
          commands: "./commands",
          bin: "horns",
          dirname: "horns",
          topics: {},
          additionalVersionFlags: [] as string[],
          plugins: [] as string[],
          hooks: {},
          topicSeparator: " " as const,
        },
      },
    });
    if (args.length > 0) {
      const commandName = args[0];

      switch (commandName) {
        case "backup":
          const backupCmd = new BackupCommand(args.slice(1), config);
          await backupCmd.run();
          return;
        case "--version":
        case "-v":
          console.log(VERSION);
          return;

        case "--help":
        case "-h":
        case "help":
          console.log(HELP_TEXT);
          return;

        default:
          console.error(`command ${commandName} not found`);
          console.log("Run 'horns --help' for available commands");
          process.exit(2);
      }
    } else {
      console.log(HELP_TEXT);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
