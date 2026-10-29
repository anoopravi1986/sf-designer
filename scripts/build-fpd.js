#!/usr/bin/env node
/*
 * Assembles public/assets/js/FancyProductDesigner.js from the source
 * files in public/assets/js/fpd-src/, in order.
 *
 * Why this exists: FancyProductDesigner.js is a single-scope, ~40,000
 * line third-party bundle with StyleFlip's customizations threaded
 * through it. It cannot be split into independently-loaded <script>
 * files without breaking shared internal state, so instead it is edited
 * as 6 organized source files and reassembled into the one file the app
 * actually loads (src/index.html). The generated file's behavior is
 * identical to editing the monolith directly - this only changes where
 * you edit, not what ships.
 *
 * Run via: npm run build:fpd (also runs automatically before
 * "npm run build" / "npm start" - see package.json).
 */
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'public', 'assets', 'js', 'fpd-src');
const OUT_FILE = path.join(__dirname, '..', 'public', 'assets', 'js', 'FancyProductDesigner.js');

const PARTS = [
  '01-vendor-fabricjs-runtime.js',
  '02-engine-core-utils.js',
  '03-sidebar-content-modules.js',
  '04-layers-and-shell-modules.js',
  '05-element-toolbar-interactions.js',
  '06-engine-main-class.js',
];

function build() {
  const missing = PARTS.filter(name => !fs.existsSync(path.join(SRC_DIR, name)));
  if (missing.length) {
    console.error('[build-fpd] Missing source part(s):', missing.join(', '));
    process.exit(1);
  }

  const chunks = PARTS.map(name => fs.readFileSync(path.join(SRC_DIR, name), 'utf8'));
  const output = chunks.join('');

  fs.writeFileSync(OUT_FILE, output);
  console.log(`[build-fpd] Wrote ${OUT_FILE} (${output.length.toLocaleString()} chars from ${PARTS.length} parts)`);
}

build();
