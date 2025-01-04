import { execSync } from "child_process";
import fs from "fs";
import path from "path";

function getHostTargetTriple() {
  const rustInfo = execSync("rustc -vV");
  const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];

  if (!targetTriple) {
    throw new Error("Failed to determine platform target triple");
  }

  return targetTriple;
}

function copySidecar(sourcePath, destPath) {
  if (fs.existsSync(destPath)) {
    console.log(`Destination file already exists: ${destPath}`);
    return;
  }

  if (fs.existsSync(sourcePath)) {
    if (!fs.existsSync(path.dirname(destPath))) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
    }

    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${sourcePath} to ${destPath}`);
  } else {
    console.error(`Source file does not exist: ${sourcePath}`);
  }
}

function main() {
  const tauriSrc = "src-tauri";
  const daemonSrc = "src-daemon";
  const daemonName = "webpen-daemon";

  const targetTriple = getHostTargetTriple();

  const extension = process.platform === "win32" ? ".exe" : "";
  const sourcePath = `${daemonSrc}/target/${daemonName}${extension}`;
  const destPath = `${tauriSrc}/binaries/${daemonName}-${targetTriple}${extension}`;

  copySidecar(sourcePath, destPath);
}

main();
