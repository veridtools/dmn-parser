import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { safeParse } from '../src/parse.js';

const pkgPath = join(dirname(fileURLToPath(import.meta.url)), '../package.json');
const { version } = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version: string };

const BANNER = `
██╗   ██╗███████╗██████╗ ██╗██████╗ ████████╗ ██████╗  ██████╗ ██╗     ███████╗
██║   ██║██╔════╝██╔══██╗██║██╔══██╗╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██╔════╝
██║   ██║█████╗  ██████╔╝██║██║  ██║   ██║   ██║   ██║██║   ██║██║     ███████╗
╚██╗ ██╔╝██╔══╝  ██╔══██╗██║██║  ██║   ██║   ██║   ██║██║   ██║██║     ╚════██║
 ╚████╔╝ ███████╗██║  ██║██║██████╔╝   ██║   ╚██████╔╝╚██████╔╝███████╗███████║
  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝╚═════╝    ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚══════╝
`.trimStart();

const HELP = `${BANNER}
@veridtools/dmn-parser v${version} — DMN XML parser

Usage:
  dmn-parser <file.dmn> [options]

Options:
  -j, --json          Output full DMNModel as JSON
  -s, --summary       Output summary (decisions, expressions, version)
  -e, --elements      List all indexed element IDs
  -n, --no-color      Disable ANSI colors
  -h, --help          Show this help

Exit codes:
  0  Parsed successfully
  1  Parse error or missing file
`;

const KNOWN_FLAGS = new Set([
  '--json',
  '-j',
  '--summary',
  '-s',
  '--elements',
  '-e',
  '--no-color',
  '-n',
  '--help',
  '-h',
]);

const [, , file, ...flags] = process.argv;

if (flags.includes('--help') || flags.includes('-h') || file === '--help' || file === '-h') {
  process.stdout.write(HELP);
  process.exit(0);
}

if (!file) {
  console.error(
    'Usage: dmn-parser <file.dmn> [-j|--json] [-s|--summary] [-e|--elements] [-h|--help]',
  );
  process.exit(1);
}

const unknown = flags.filter((f) => f.startsWith('-') && !KNOWN_FLAGS.has(f));
if (unknown.length > 0) {
  console.error(`Unknown option: ${unknown.join(', ')}`);
  console.error('Run `dmn-parser --help` to see available options.');
  process.exit(1);
}

let xml: string;
try {
  xml = readFileSync(file, 'utf-8');
} catch (err) {
  console.error(`Error reading file: ${(err as Error).message}`);
  process.exit(1);
}

const has = (...aliases: string[]) => aliases.some((a) => flags.includes(a));
const noColor = has('--no-color', '-n') || !!process.env.NO_COLOR || !process.stdout.isTTY;

const DIM = noColor ? '' : '\x1b[2m';
const BOLD = noColor ? '' : '\x1b[1m';
const GREEN = noColor ? '' : '\x1b[32m';
const YELLOW = noColor ? '' : '\x1b[33m';
const RED = noColor ? '' : '\x1b[31m';
const RESET = noColor ? '' : '\x1b[0m';

if (has('--json', '-j')) {
  const result = safeParse(xml);
  if (!result.success) {
    console.error(`Parse error: ${result.errors[0]?.message}`);
    process.exit(1);
  }
  // Exclude circular index from JSON output
  const { index: _index, ...rest } = result.model;
  console.log(JSON.stringify(rest, null, 2));
  process.exit(0);
}

const result = safeParse(xml);
if (!result.success) {
  console.error(`${RED}Parse error:${RESET} ${result.errors[0]?.message}`);
  process.exit(1);
}

const { model } = result;

if (has('--elements', '-e')) {
  const ids = [...model.index.keys()].sort();
  for (const id of ids) console.log(id);
  process.exit(0);
}

// Default: summary output
const exprTypes = model.decisions
  .map((d) => d.expression?.type ?? 'none')
  .reduce(
    (acc, t) => {
      acc[t] = (acc[t] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

console.log(`${BOLD}${file}${RESET}`);
console.log(`  ${DIM}DMN version:${RESET}    ${GREEN}${model.dmnVersion}${RESET}`);
console.log(`  ${DIM}id:${RESET}             ${model.id}`);
console.log(`  ${DIM}name:${RESET}           ${model.name}`);
console.log(`  ${DIM}namespace:${RESET}      ${DIM}${model.namespace}${RESET}`);
console.log('');
console.log(`  ${BOLD}DRG elements${RESET}`);
console.log(`  ${DIM}decisions:${RESET}              ${YELLOW}${model.decisions.length}${RESET}`);
console.log(`  ${DIM}inputData:${RESET}              ${YELLOW}${model.inputData.length}${RESET}`);
console.log(
  `  ${DIM}businessKnowledgeModels:${RESET} ${YELLOW}${model.businessKnowledgeModels.length}${RESET}`,
);
console.log(
  `  ${DIM}knowledgeSources:${RESET}       ${YELLOW}${model.knowledgeSources.length}${RESET}`,
);
console.log(
  `  ${DIM}decisionServices:${RESET}       ${YELLOW}${model.decisionServices.length}${RESET}`,
);
console.log('');
console.log(`  ${BOLD}Expressions${RESET}`);
for (const [type, count] of Object.entries(exprTypes)) {
  console.log(`  ${DIM}${type}:${RESET} ${YELLOW}${count}${RESET}`);
}
console.log('');
console.log(`  ${DIM}itemDefinitions:${RESET}  ${model.itemDefinitions.length}`);
console.log(`  ${DIM}imports:${RESET}          ${model.imports.length}`);
console.log(`  ${DIM}indexed elements:${RESET} ${model.index.size}`);
