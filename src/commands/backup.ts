import { Command } from "@oclif/core";
import { getAptPackages } from "../utils/packages.js";

export default class Backup extends Command {
  static description = "Test backup command";

  async run(): Promise<void> {
    await getAptPackages();
  }
}
