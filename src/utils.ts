import { execSync } from "child_process";
import { readdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir, version } from "os";

// Packages
export const getAptPackages = (): string[] => {
  const installedPackages = execSync(
    "dpkg --get-selections | grep -v deinstall",
    { encoding: "utf-8" }
  );

  const packageNames = installedPackages
    .trim()
    .split("\n")
    .map((line) => line.split(/\s+/)[0].trim())
    .filter(
      (name) => name.length > 0 && name !== "install" && name !== "deinstall"
    );

  return packageNames;
};

// Json structure
export const structureBackup = (aptPackages: string[]) => {
  return {
    custom_packages: {
      apt: aptPackages,
    },
  };
};

// Other utils
const getRhinoSnapshot = (): string => {
  try {
    const osRelease = execSync("cat /etc/os-release", { encoding: "utf-8" });
    const snapshot = osRelease.match(/^VERSION_ID="?([^"\n]+)"?$/m);
    return snapshot ? snapshot[1] : "unknown";
  } catch (error) {
    return "unknown";
  }
};

export const getIteration = (): string => {
  const snapshot = getRhinoSnapshot();
  const configDir = join(homedir(), ".config", "horns");
  if (!existsSync(configDir)) {
    return `${snapshot}-1`;
  }

  try {
    const files = readdirSync(configDir);
    const snapshots = new RegExp(
      `^${snapshot.replace(/\./g, "\\.")}-([0-9]+)\\.json$`
    );
    const matches = files
      .filter((file) => snapshots.test(file))
      .map((file) => {
        const match = file.match(snapshots);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => !isNaN(num));
    const maxIteration = matches.length > 0 ? Math.max(...matches) : 0;
    return `${snapshot}-${maxIteration + 1}`;
  } catch (error) {
    return `${snapshot}-1`;
  }
};
