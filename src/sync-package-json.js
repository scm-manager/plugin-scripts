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

/* eslint no-param-reassign: 0 */

const semver = require("semver");

const buildPackages = [
  "@scm-manager/babel-preset",
  "@scm-manager/eslint-config",
  "@scm-manager/jest-preset",
  "@scm-manager/prettier-config",
  "@scm-manager/tsconfig",
  "@scm-manager/plugin-scripts",
  "jest",
  "@types/jest",
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
