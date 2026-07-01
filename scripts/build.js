/**
 * unified-scrollbar - Build Script (zero external deps)
 * Generates: dist/index.cjs.js, dist/index.esm.js, dist/index.umd.js,
 *            dist/index.d.ts, dist/unified-scrollbar.css
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SRC = path.join(ROOT, 'src');

// ── Helpers ──────────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readSrc(file) {
  return fs.readFileSync(path.join(SRC, file), 'utf-8');
}

function writeDist(file, content) {
  const dest = path.join(DIST, file);
  fs.writeFileSync(dest, content, 'utf-8');
  const size = (Buffer.byteLength(content, 'utf-8') / 1024).toFixed(2);
  console.log(`  ✓ ${file.padEnd(32)} ${size} KB`);
}

// ── Read core source ──────────────────────────────────────────────────────────

const coreRaw = readSrc('core.js');

// Strip the module.exports block from core to produce re-usable function body
// We'll use a different strategy: inline the entire core and wrap it.

// ── CJS build ─────────────────────────────────────────────────────────────────

const cjsContent = `'use strict';
// unified-scrollbar v1.0.0 — CJS build
${coreRaw}
`;

// ── UMD build ─────────────────────────────────────────────────────────────────

// Replace module.exports = {...} with UMD wrapper
const coreFunctions = coreRaw.replace(
  /module\.exports\s*=\s*\{[\s\S]*?\};?\s*$/m,
  ''
);

const umdContent = `/* unified-scrollbar v1.0.0 — UMD build (browser + Node) */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.UnifiedScrollbar = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

${coreFunctions}

  return {
    apply: apply,
    applyTheme: applyTheme,
    inject: inject,
    remove: remove,
    generateCSS: generateCSS,
    getDefaults: getDefaults,
    themes: THEMES,
    DEFAULT_OPTIONS: DEFAULT_OPTIONS,
    version: '1.0.0',
  };
}));
`;

// ── ESM build ─────────────────────────────────────────────────────────────────

const esmCore = coreRaw
  .replace(/^'use strict';\n?/, '')
  .replace(/module\.exports\s*=\s*\{[\s\S]*?\};?\s*$/m, '');

const esmContent = `/* unified-scrollbar v1.0.0 — ESM build */
${esmCore}

export { apply, applyTheme, inject, remove, generateCSS, getDefaults, THEMES as themes, DEFAULT_OPTIONS };
export default { apply, applyTheme, inject, remove, generateCSS, getDefaults, themes: THEMES, DEFAULT_OPTIONS, version: '1.0.0' };
`;

// ── CSS standalone build ───────────────────────────────────────────────────────
// Generate the default theme CSS using the core generateCSS function

// We need to evaluate generateCSS without a DOM — it just returns a string
// Temporarily mock the isBrowser check
const mockCore = coreRaw.replace(
  'function isBrowser() {\n  return typeof window !== \'undefined\' && typeof document !== \'undefined\';\n}',
  'function isBrowser() { return false; }'
);

let generatedCSS = '';
try {
  // Use a temp module approach
  const tmpFile = path.join(DIST, '__tmp_core.js');
  ensureDir(DIST);
  fs.writeFileSync(tmpFile, mockCore, 'utf-8');
  // Clear require cache
  delete require.cache[require.resolve(tmpFile)];
  const tmpModule = require(tmpFile);
  generatedCSS = tmpModule.generateCSS({});
  fs.unlinkSync(tmpFile);
} catch (e) {
  console.warn('CSS generation fallback:', e.message);
  // Fallback: write a static default CSS
  generatedCSS = buildDefaultCSS();
}

function buildDefaultCSS() {
  return `/* unified-scrollbar v1.0.0 — Default Theme CSS */
/* Import this file to apply default scrollbar styles globally */

/* Firefox */
* {
  scrollbar-width: auto;
  scrollbar-color: #888 transparent;
}

/* WebKit / Blink */
*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
*::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 0;
}
*::-webkit-scrollbar-track:hover {
  background: rgba(0,0,0,0.05);
}
*::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
  border: none;
  box-shadow: none;
  transition: background 0.2s ease;
}
*::-webkit-scrollbar-thumb:hover {
  background: #555;
}
*::-webkit-scrollbar-thumb:active {
  background: #333;
}
*::-webkit-scrollbar-corner {
  background: transparent;
}`;
}

const cssContent = `/* unified-scrollbar v1.0.0 — Default Theme CSS
 * Import this file to apply default scrollbar styles globally.
 * For custom theming, use the JS API instead.
 *
 * Usage (CSS import):
 *   @import 'unified-scrollbar/css';
 *
 * Usage (JS import - auto applies):
 *   import 'unified-scrollbar/style.css';
 */

${generatedCSS}
`;

// ── TypeScript declarations ────────────────────────────────────────────────────

const dtsContent = `// unified-scrollbar v1.0.0 — TypeScript Declarations

export interface ScrollbarOptions {
  /** Scrollbar track width (vertical). Default: '8px' */
  width?: string;
  /** Scrollbar track height (horizontal). Default: '8px' */
  height?: string;
  /** Thumb color. Default: '#888' */
  thumbColor?: string;
  /** Thumb hover color. Default: '#555' */
  thumbHoverColor?: string;
  /** Thumb active/click color. Default: '#333' */
  thumbActiveColor?: string;
  /** Track background color. Default: 'transparent' */
  trackColor?: string;
  /** Track hover background color. Default: 'rgba(0,0,0,0.05)' */
  trackHoverColor?: string;
  /** Thumb border-radius. Default: '4px' */
  borderRadius?: string;
  /**
   * Target selector for scrollbar styles.
   * - 'global'   — applies to all elements (*)
   * - 'body'     — applies to html/body only
   * - any string — treated as a CSS selector
   * Default: 'global'
   */
  target?: 'global' | 'body' | string;
  /** Auto-apply styles on init. Default: true */
  autoApply?: boolean;
  /** CSS scrollbar-gutter value. Default: 'auto' */
  scrollbarGutter?: 'auto' | 'stable' | 'stable both-edges';
  /** Firefox scrollbar-color override. Auto-derived if null. */
  firefoxScrollbarColor?: string | null;
  /** Firefox scrollbar-width. Default: 'auto' */
  firefoxScrollbarWidth?: 'auto' | 'thin' | 'none';
  /** CSS box-shadow on the thumb. Default: 'none' */
  thumbBoxShadow?: string;
  /** CSS border on the thumb. Default: 'none' */
  thumbBorder?: string;
  /** Track border-radius. Default: '0' */
  trackBorderRadius?: string;
  /** CSS border on the track. Default: 'none' */
  trackBorder?: string;
  /** CSS transition on thumb background. Default: 'background 0.2s ease' */
  thumbTransition?: string;
}

export type ThemeName = 'default' | 'dark' | 'minimal' | 'macos' | 'soft' | 'neon' | 'hidden';

/**
 * Apply unified scrollbar styles to the document.
 * @param options - Partial scrollbar options to override defaults
 */
export function apply(options?: ScrollbarOptions): void;

/**
 * Apply a named preset theme with optional overrides.
 * @param themeName - Name of the preset theme
 * @param overrides - Optional option overrides
 */
export function applyTheme(themeName: ThemeName, overrides?: ScrollbarOptions): void;

/**
 * Inject a raw CSS string as unified scrollbar styles.
 * @param css - Raw CSS string
 */
export function inject(css: string): void;

/**
 * Remove unified scrollbar styles from the document.
 */
export function remove(): void;

/**
 * Generate the CSS string without injecting it (for SSR / frameworks).
 * @param options - Partial scrollbar options
 * @returns CSS string
 */
export function generateCSS(options?: ScrollbarOptions): string;

/**
 * Get a copy of the default options.
 */
export function getDefaults(): Required<ScrollbarOptions>;

/** Preset themes map */
export const themes: Record<ThemeName, ScrollbarOptions>;

/** Default options object */
export const DEFAULT_OPTIONS: Required<ScrollbarOptions>;

/** Package version */
export const version: string;

declare const _default: {
  apply: typeof apply;
  applyTheme: typeof applyTheme;
  inject: typeof inject;
  remove: typeof remove;
  generateCSS: typeof generateCSS;
  getDefaults: typeof getDefaults;
  themes: typeof themes;
  DEFAULT_OPTIONS: typeof DEFAULT_OPTIONS;
  version: string;
};
export default _default;
`;

// ── Write all output files ─────────────────────────────────────────────────────

console.log('\n📦  Building unified-scrollbar...\n');
ensureDir(DIST);

writeDist('index.cjs.js', cjsContent);
writeDist('index.esm.js', esmContent);
writeDist('index.umd.js', umdContent);
writeDist('unified-scrollbar.css', cssContent);
writeDist('index.d.ts', dtsContent);

console.log('\n✅  Build complete → dist/\n');
