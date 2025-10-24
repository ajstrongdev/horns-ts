import { execSync } from "child_process";

export const getAptPackages = (): void => {
  const installedPackages = execSync(
    "dpkg --get-selections | grep -v deinstall",
    { encoding: "utf-8" }
  );

  const packageNames = installedPackages
    .trim()
    .split("\n")
    .map((line) => line.split(":")[0].trim())
    .filter((name) => name.length > 0);

  console.log(packageNames);
};
