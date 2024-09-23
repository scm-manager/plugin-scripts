class VerifyScmImportsFromUiPluginsOnly {
  constructor(externalModuleNames) {
    this.externalModuleNames = externalModuleNames;
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap("VerifyScmImportsFromUiPluginsOnly", normalModuleFactory => {
      normalModuleFactory.hooks.beforeResolve.tap("VerifyScmImportsFromUiPluginsOnly", resolveData => {
        if (!resolveData) return;
        if (
          resolveData.request.startsWith("@scm-manager/ui-") &&
          resolveData.request !== "@scm-manager/ui-core" &&
          this.externalModuleNames.indexOf(resolveData.request) < 0
        ) {
          throw new Error(
            `Importing module "${resolveData.request}" is not allowed. If this is a new module from SCM-Manager Core, please add it to the dependencies in ui-plugins, first.`
          );
        }
      });
    });
  }
}
module.exports = VerifyScmImportsFromUiPluginsOnly;
