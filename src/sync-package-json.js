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

/* eslint no-param-reassign: 0 */

const semver = require("semver");

const buildPackages = [
  "@scm-manager/babel-preset",
  "@scm-manager/eslint-config",
  "@scm-manager/jest-preset",
  "@scm-manager/prettier-config",
  "@scm-manager/tsconfig",
  "@scm-manager/plugin-scripts"
];

const needsUpdate = (referenceVersion, packageJSONVersion) => {
  const referenceMinVersion = semver.minVersion(referenceVersion);
  if (packageJSONVersion) {
    const packageJsonMinVersion = semver.minVersion(packageJSONVersion);
    return semver.gt(referenceMinVersion, packageJsonMinVersion);
  }
  return true;
};

const sync = (reference, packageJSON, key) => {
  if (!packageJSON[key]) {
    packageJSON[key] = {};
  }

  let changed = false;

  const keys = Object.keys(reference[key]);
  keys.forEach(name => {
    if (packageJSON[key][name] !== reference[key][name]) {
      if (buildPackages.includes(name)) {
        if (needsUpdate(reference[key][name], packageJSON[key][name])) {
          console.log("build dependency", name, "has changed from", packageJSON[key][name], "to", reference[key][name]);
          packageJSON[key][name] = reference[key][name];
          changed = true;
        }
      } else {
        console.log(name, "has changed from", packageJSON[key][name], "to", reference[key][name]);
        packageJSON[key][name] = reference[key][name];
        changed = true;
      }
    }
  });

  return changed;
};

module.exports = (reference, packageJSON) => {
  let dep = false;
  if (reference.dependencies) {
    dep = sync(reference, packageJSON, "dependencies");
  }
  let devDep = false;
  if (reference.devDependencies) {
    devDep = sync(reference, packageJSON, "devDependencies");
  }
  return dep || devDep;
};
