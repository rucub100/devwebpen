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

/**
 * This script downloads the Material Design Icons Variable Fonts from
 * https://github.com/google/material-design-icons
 *
 * The icons are available in three styles: Outlined, Rounded, and Sharp.
 * The project is licensed under Apache License 2.0.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl =
  "https://github.com/google/material-design-icons/raw/refs/heads/master/variablefont/";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dirPath = join(__dirname, "..", "src", "assets");

function* fileNameGenerator() {
  const styles = ["Outlined", "Rounded", "Sharp"];
  const extensions = ["woff2"];

  for (const style of styles) {
    for (const extension of extensions) {
      yield `MaterialSymbols${style}[FILL,GRAD,opsz,wght].${extension}`;
    }
  }
}

async function downloadFonts() {
  try {
    await mkdir(dirPath, { recursive: true });

    for (const fileName of fileNameGenerator()) {
      const fileUrl = `${baseUrl}${encodeURIComponent(fileName)}`;
      const filePath = join(dirPath, fileName);

      const res = await fetch(fileUrl);
      const buffer = await res.arrayBuffer();
      await writeFile(filePath, Buffer.from(buffer), "binary");
    }
  } catch (err) {
    console.error(err);
  }
}

downloadFonts()
  .then(() => console.log("Download complete"))
  .catch(console.error);
