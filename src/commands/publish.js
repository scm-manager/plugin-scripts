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

const yarn = require("../yarn");
const versions = require("../versions");

module.exports = args => {
  if (args.length < 1) {
    console.log("usage plugin-scripts publish <version>");
    process.exit(1);
  }

  const version = args[0];
  const index = version.indexOf("-SNAPSHOT");
  if (index > 0) {
    const snapshotVersion = `${version.substring(0, index)}-${versions.createSnapshotVersion()}`;
    console.log(`publish snapshot release ${snapshotVersion}`);
    yarn.version(snapshotVersion);
    yarn.publish(snapshotVersion);
    yarn.version(version);
  } else {
    // ?? not sure
    yarn.publish(version);
  }
};
