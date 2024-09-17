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
// eslint-disable-next-line import/no-unresolved
const { WebpackPluginServe: ServePlugin } = require("webpack-plugin-serve");
const VerifyScmImportsFromUiPluginsOnly = require("./verifyScmImportsFromUiPluginsOnly.js")

const root = process.cwd();

const packageJsonPath = path.join(root, "package.json");
const packageJSON = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: "UTF-8" }));
let uiPluginsPackageJsonPath = path.join(root, "node_modules", "@scm-manager", "ui-plugins", "package.json");
console.log(uiPluginsPackageJsonPath);
if (!fs.existsSync(uiPluginsPackageJsonPath)) {
  uiPluginsPackageJsonPath = require.resolve('@scm-manager/ui-plugins/package.json');
}
const uiPluginsPackageJSON = JSON.parse(fs.readFileSync(uiPluginsPackageJsonPath, {encoding: "UTF-8"}));

let { name } = packageJSON;
const orgaIndex = name.indexOf("/");
if (orgaIndex > 0) {
  name = name.substring(orgaIndex + 1);
}

let output = process.env.BUNDLE_OUTPUT;
if (!output) {
  if (fs.existsSync(path.join(root, "pom.xml"))) {
    output = path.join(root, "target", `${name}-${packageJSON.version}`, "webapp", "assets");
  } else {
    output = path.join(root, "build", "webapp", "assets");
  }
}

const uiPluginsDependencies = Object.keys(uiPluginsPackageJSON.dependencies);

module.exports = mode => {
  const plugins = [new VerifyScmImportsFromUiPluginsOnly(uiPluginsDependencies)];
  const entries = [path.resolve(__dirname, "webpack-public-path.js"), packageJSON.main || "src/main/js/index.ts"];

  if (mode !== "production") {
    const servePort = process.env.SERVE_PORT || "55000";

    plugins.push(
      new ServePlugin({
        static: output,
        status: false,
        liveReload: true,
        host: "127.0.0.1",
        port: Number(servePort)
      })
    );
    entries.unshift("webpack-plugin-serve/client");
  }

  return {
    context: root,
    entry: {
      [name]: entries
    },
    mode,
    stats: "minimal",
    devtool: "eval-cheap-module-source-map",
    target: "web",
    externals: [
      ...uiPluginsDependencies,
      /^@scm-manager\/scm-.*-plugin$/i,
      // We need to exclude the core package from the externals, because this
      // has not been listed as externals in older core versions.
      // Without this exclusion, the build fails, because webpack tries to bundle
      // the typescript code from ui-core, which fails.
      "@scm-manager/ui-core"
    ],
    module: {
      rules: [
        {
          test: /\.(js|ts|jsx|tsx)$/i,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@scm-manager/babel-preset"]
            }
          }
        },
        {
          test: /\.(css|scss|sass)$/i,
          use: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.(png|svg|jpg|gif|woff2?|eot|ttf)$/,
          use: ["file-loader"]
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".json"],
      fallback: {
        fs: false,
        net: false,
        tls: false
      }
    },
    resolveLoader: {
      modules: [path.join(__dirname, "..", "node_modules"), "node_modules"],
      extensions: [".js", ".json"],
      mainFields: ["loader", "main"]
    },
    plugins,
    output: {
      path: output,
      filename: "[name].bundle.js",
      chunkFilename: `${name}.[name].chunk.js`,
      library: name,
      libraryTarget: "amd",
      publicPath: ""
    }
  };
};
