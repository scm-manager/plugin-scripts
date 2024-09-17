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
  const config = createPluginConfig("production");

  webpack(config, (err, stats) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    if (stats && stats.hasErrors()) {
      console.log(stats.compilation.errors);
      process.exit(1);
    }

    console.log(
      stats.toString({
        colors: true
      })
    );
  });
};
