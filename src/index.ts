#! /usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';

import { getPackageJsonVersion } from './utils';
import { runScript } from './runScript';

const program = new Command();

const argv = process.argv;

const args = argv.slice(2);
const help = args.includes('--help') || args.includes('-h');

if (help) {
  console.log(figlet.textSync('Run Scripts', { horizontalLayout: 'full' }));
}

program
  .version(getPackageJsonVersion())
  .description('The effortlessly way to run your package.json scripts')
  .option('--ai', 'Use AI to explain the package.json scripts')
  .option('-v, --view', 'View the package.json scripts')
  .parse(argv);

const options = program.opts();

runScript({ withAi: options.ai, onlyView: options.view });
