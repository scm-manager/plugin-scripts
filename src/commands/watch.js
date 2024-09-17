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

const webpack = require("webpack");
const createPluginConfig = require("../createPluginConfig");

module.exports = () => {
  const config = createPluginConfig("development");
  const compiler = webpack(config);

  const watcher = compiler.watch({}, (_, stats) => {
    console.log(
      stats.toString({
        colors: true
      })
    );
  });

  // if we could access the parent id of our current process
  // we start watching it, because a changing parent id means
  // that the parent process has died.
  // On linux our process does not receive any signal if our parent dies,
  // e.g.: ctrl+c in gradle
  if (process.ppid) {
    const { ppid } = process;
    setInterval(() => {
      if (ppid !== process.ppid) {
        watcher.close();
        process.exit();
      }
    }, 500);
  }
};
