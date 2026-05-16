<p align="center">
  <a href="https://www.npmjs.com/package/@gabsf-dev/run-script"><img src="https://img.shields.io/npm/v/%40gabsf-dev%2Frun-script" alt="npm version"></a>
  <a href="https://github.com/gabsf-dev/run-script/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="RunScript is released under the MIT license."></a>
</p>
<p align="center">
  <a href="https://github.com/gabsf-dev/run-script/blob/main/.github/workflows/publish.yml"><img alt="GitHub CI Status" src="https://img.shields.io/github/actions/workflow/status/gabsf-dev/run-script/publish.yml?branch=main&logo=github&label=CI"></a>
</p>

<!-- A spacer -->
<p>&nbsp;</p>

<h1 align="center">RunScript</h1>

The effortlessly way to run your js scripts

## Getting Started

To use RunScript it's simple as to run:

```bash
npx @gabsf-dev/run-script
```

Or to install globally:

```bash
npm i -g @gabsf-dev/run-script
```

and run it using:

```bash
run-script
```

After that, just choose the script that you want to run, and RunScript make the rest, running your script automatically based on your package manager.

## Flags

RunScript provides the following flags:

- _-V, --version_

Logs the RunScript current version.

```bash
npx @gabsf-dev/run-script -V
```

- _-h, --help_

Logs the RunScript help.

```bash
npx @gabsf-dev/run-script -h
```

- _-v, --view_

Only show the scripts listed in your `package.json` in a table format.

```bash
npx @gabsf-dev/run-script --view
```

<p align="center">
  <img src="./assets/run-script-view.png" alt="RunScript view example">
</p>

## License

RunScript is [MIT licensed](./LICENSE).

## Copyright

Copyright Contributors to the RunScript project.
