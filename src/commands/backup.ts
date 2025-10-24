import { Command } from "@oclif/core";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { getAptPackages, structureBackup, getIteration } from "../utils.js";

export default class Backup extends Command {
  static description = "Generate a backup configuration JSON file";

  async run(): Promise<void> {
    const aptPackages = getAptPackages();
    const backupJson = structureBackup(aptPackages);
    const versionIteration = getIteration();

    const configDir = join(homedir(), ".config", "horns");

    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }

    const outputPath = join(configDir, `${versionIteration}.json`);
    writeFileSync(outputPath, JSON.stringify(backupJson, null, 2));

    this.log(`Backup configuration saved to: ${outputPath}`);
    this.log(`Version: ${versionIteration}`);
  }
}
