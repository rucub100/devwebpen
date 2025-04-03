/*
 * Copyright 2025 Ruslan Curbanov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

function copySidecarDebugger(sourcePath, destPath) {
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
  const daemonDebuggerSrc = "src-daemon-debugger";
  const daemonName = "devwebpen-daemon";
  const daemonDebuggerName = "devwebpen-daemon-debugger";

  const targetTriple = getHostTargetTriple();

  const extension = process.platform === "win32" ? ".exe" : "";
  const sourcePath = `${daemonDebuggerSrc}/target/${daemonDebuggerName}${extension}`;
  const destPath = `${tauriSrc}/binaries/${daemonName}-${targetTriple}${extension}`;

  copySidecarDebugger(sourcePath, destPath);
}

main();
