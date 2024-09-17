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

const { spawnSync } = require("child_process");
const os = require("os");

const yarnCmd = os.platform() === "win32" ? "yarn.cmd" : "yarn";

const yarn = args => {
  const result = spawnSync(yarnCmd, args, { stdio: "inherit" });
  if (result.error) {
    console.log("could not start yarn command:", result.error);
    process.exit(2);
  } else if (result.status !== 0) {
    console.log("yarn process ends with status code:", result.status);
    process.exit(3);
  }
};

const version = v => {
  yarn(["version", "--no-git-tag-version", "--new-version", v]);
};

const publish = v => {
  yarn(["publish", "--new-version", v]);
};

module.exports = {
  version,
  publish,
  yarn
};
