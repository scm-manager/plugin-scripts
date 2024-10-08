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

const sync = require("./sync-package-json");

describe("sync package.json", () => {
  it("should sync dependencies and devDependencies", () => {
    const reference = {
      dependencies: {
        react: "16.10.0"
      },
      devDependencies: {
        jest: "26.0.0"
      }
    };

    const packageJSON = {
      dependencies: {
        react: "16.8.0"
      },
      devDependencies: {
        jest: "24.0.1"
      }
    };

    const synced = sync(reference, packageJSON);
    expect(synced).toBe(true);
    expect(packageJSON.dependencies.react).toBe("16.10.0");
    expect(packageJSON.devDependencies.jest).toBe("26.0.0");
  });

  it("should return false if everything is in sync", () => {
    const reference = {
      dependencies: {
        react: "16.10.0"
      },
      devDependencies: {
        jest: "26.0.0"
      }
    };

    const packageJSON = {
      dependencies: {
        react: "16.10.0",
        "react-dom": "16.10.0"
      },
      devDependencies: {
        jest: "26.0.0"
      }
    };

    const synced = sync(reference, packageJSON);
    expect(synced).toBe(false);
    expect(packageJSON.dependencies.react).toBe("16.10.0");
    expect(packageJSON.dependencies["react-dom"]).toBe("16.10.0");
    expect(packageJSON.devDependencies.jest).toBe("26.0.0");
  });

  it("should only update build depdencies, if the reference is newer", () => {
    const reference = {
      devDependencies: {
        "@scm-manager/jest": "2.10.0",
        "@scm-manager/eslint-config": "2.10.0"
      }
    };

    const packageJSON = {
      devDependencies: {
        "@scm-manager/jest": "2.9.0",
        "@scm-manager/eslint-config": "^2.11.0"
      }
    };

    const synced = sync(reference, packageJSON);
    expect(synced).toBe(true);
    expect(packageJSON.devDependencies["@scm-manager/jest"]).toBe("2.10.0");
    expect(packageJSON.devDependencies["@scm-manager/eslint-config"]).toBe("^2.11.0");
  });

  it("should sync new created plugins", () => {
    const reference = {
      devDependencies: {
        "@scm-manager/babel-preset": "2.10.0"
      }
    };

    const packageJSON = {
      devDependencies: {
        "@scm-manager/ui-plugins": "2.10.0",
        "@scm-manager/plugin-scripts": "^1.0.2"
      }
    };

    const synced = sync(reference, packageJSON);
    expect(synced).toBe(true);
  });
});
