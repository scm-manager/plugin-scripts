/*
 * MIT License
 *
 * Copyright (c) 2020-present Cloudogu GmbH and Contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const path = require("path");
const fs = require("fs");
const sync = require("../sync-package-json");
const { yarn } = require("../yarn");

const readJson = filePath => {
  return JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
};

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, "  "), { encoding: "utf-8" });
};

module.exports = () => {
  const referencePath = path.join(process.cwd(), "node_modules", "@scm-manager", "ui-plugins", "package.json");
  const reference = readJson(referencePath);

  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = readJson(packageJsonPath);

  const changed = sync(reference, packageJson);
  if (changed) {
    writeJson(packageJsonPath, packageJson);
    yarn(["install"]);
  }
};
