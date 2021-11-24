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
// eslint-disable-next-line import/no-unresolved
const { WebpackPluginServe: ServePlugin } = require("webpack-plugin-serve");

const root = process.cwd();

const packageJsonPath = path.join(root, "package.json");
const packageJSON = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: "UTF-8" }));

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

module.exports = mode => {
  const plugins = [];
  const entries = [path.resolve(__dirname, "webpack-public-path.js"), packageJSON.main || "src/main/js/index.js"];

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
      "react",
      "react-dom",
      "react-i18next",
      "react-router-dom",
      "styled-components",
      "@scm-manager/ui-api",
      "@scm-manager/ui-types",
      "@scm-manager/ui-extensions",
      "@scm-manager/ui-components",
      "classnames",
      "query-string",
      "redux",
      "react-redux",
      "react-hook-form",
      "react-query",
      /^@scm-manager\/scm-.*-plugin$/i
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
