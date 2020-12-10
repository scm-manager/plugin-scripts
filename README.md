<p align="center">
  <a href="https://www.scm-manager.org/">
    <img alt="SCM-Manager" src="https://download.scm-manager.org/images/logo/scm-manager_logo.png" width="500" />
  </a>
</p>
<h1 align="center">
  @scm-manager/plugin-scripts
</h1>

Plugin scripts provide commands which are required to build and push the frontend code of SCM-Manager Plugins.

## Commands

* **build** Creates production ready bundle from frontend code
* **watch** Creates a development bundle, rebundle it on file change and sends a change notification to the browser
* **publish** Publishes the code on the npm registry
* **postinstall** Aligns the plugin dependencies with those from the core of SCM-Manager

## Installation

Install the `@scm-manager/plugin-scripts` as dev dependency:

```bash
yarn add --dev @scm-manager/jest-preset
```

Add the desired commands to the script section of your `package.json`:

```json
"scripts": {
  "build": "plugin-scripts build",
  "watch": "plugin-scripts watch",
  "publish": "plugin-scripts publish",
  "postinstall": "plugin-scripts postinstall"
}
```

## Need help?

Looking for more guidance? Full documentation lives on our [homepage](https://www.scm-manager.org/docs/) or the dedicated pages for our [plugins](https://www.scm-manager.org/plugins/). Do you have further ideas or need support?

- **Community Support** - Contact the SCM-Manager support team for questions about SCM-Manager, to report bugs or to request features through the official channels. [Find more about this here](https://www.scm-manager.org/support/).

- **Enterprise Support** - Do you require support with the integration of SCM-Manager into your processes, with the customization of the tool or simply a service level agreement (SLA)? **Contact our development partner Cloudogu! Their team is looking forward to discussing your individual requirements with you and will be more than happy to give you a quote.** [Request Enterprise Support](https://cloudogu.com/en/scm-manager-enterprise/).
