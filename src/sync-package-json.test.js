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
