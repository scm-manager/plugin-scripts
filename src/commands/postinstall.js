/*
 * Copyright (c) 2020 - present Cloudogu GmbH
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see https://www.gnu.org/licenses/.
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
