/**
 * unified-scrollbar - Core Module
 * Provides cross-browser scrollbar unification with full customization.
 */

'use strict';

// ─── Default Configuration ────────────────────────────────────────────────────

const DEFAULT_OPTIONS = {
  // Appearance
  width: '8px',
  height: '8px',
  thumbColor: '#888',
  thumbHoverColor: '#555',
  thumbActiveColor: '#333',
  trackColor: 'transparent',
  trackHoverColor: 'rgba(0,0,0,0.05)',
  borderRadius: '4px',

  // Behavior
  target: 'global',      // 'global' | 'body' | CSS selector string
  autoApply: true,       // inject styles immediately on init
  scrollbarGutter: 'auto', // 'auto' | 'stable' | 'stable both-edges'

  // Firefox-specific (scrollbar-color / scrollbar-width)
  firefoxScrollbarColor: null,  // auto-derived from thumbColor + trackColor if null
  firefoxScrollbarWidth: 'auto', // 'auto' | 'thin' | 'none'

  // Optional box-shadow / border on thumb
  thumbBoxShadow: 'none',
  thumbBorder: 'none',
  trackBorderRadius: '0',
  trackBorder: 'none',

  // Transition animation
  thumbTransition: 'background 0.2s ease',
};

// ─── Style ID to track injected tags ─────────────────────────────────────────

const STYLE_ID = 'unified-scrollbar-styles';

// ─── Utility ─────────────────────────────────────────────────────────────────

function mergeOptions(defaults, overrides) {
  return Object.assign({}, defaults, overrides);
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function removeExistingStyle() {
  if (!isBrowser()) return;
  const el = document.getElementById(STYLE_ID);
  if (el) el.parentNode.removeChild(el);
}

// ─── CSS Generation ───────────────────────────────────────────────────────────

/**
 * Resolves the CSS selector(s) for the scrollbar rules.
 *
 * @param {string} target - 'global' | 'body' | any CSS selector
 * @returns {{ webkit: string, firefox: string }}
 */
function resolveSelectors(target) {
  if (target === 'global') {
    return {
      webkit: '*',
      firefox: '*',
    };
  }
  if (target === 'body') {
    return {
      webkit: 'html, body',
      firefox: 'html',
    };
  }
  // Custom selector (e.g. '.my-container', '#sidebar')
  return {
    webkit: target,
    firefox: target,
  };
}

/**
 * Build the complete CSS string for the given options.
 *
 * @param {object} opts - merged options
 * @returns {string}
 */
function buildCSS(opts) {
  const { webkit, firefox } = resolveSelectors(opts.target);

  const firefoxColor = opts.firefoxScrollbarColor
    ? opts.firefoxScrollbarColor
    : `${opts.thumbColor} ${opts.trackColor === 'transparent' ? 'transparent' : opts.trackColor}`;

  // ── Firefox (standards-based) ──────────────────────────────────────────────
  const ffCSS = `
/* unified-scrollbar: Firefox */
${firefox} {
  scrollbar-width: ${opts.firefoxScrollbarWidth};
  scrollbar-color: ${firefoxColor};
  scrollbar-gutter: ${opts.scrollbarGutter};
}`.trim();

  // ── WebKit / Blink (Chrome, Safari, Edge, Opera) ──────────────────────────
  const wkCSS = `
/* unified-scrollbar: WebKit */
${webkit}::-webkit-scrollbar {
  width: ${opts.width};
  height: ${opts.height};
}
${webkit}::-webkit-scrollbar-track {
  background: ${opts.trackColor};
  border-radius: ${opts.trackBorderRadius};
  border: ${opts.trackBorder};
}
${webkit}::-webkit-scrollbar-track:hover {
  background: ${opts.trackHoverColor};
}
${webkit}::-webkit-scrollbar-thumb {
  background: ${opts.thumbColor};
  border-radius: ${opts.borderRadius};
  border: ${opts.thumbBorder};
  box-shadow: ${opts.thumbBoxShadow};
  transition: ${opts.thumbTransition};
}
${webkit}::-webkit-scrollbar-thumb:hover {
  background: ${opts.thumbHoverColor};
}
${webkit}::-webkit-scrollbar-thumb:active {
  background: ${opts.thumbActiveColor};
}
${webkit}::-webkit-scrollbar-corner {
  background: ${opts.trackColor};
}`.trim();

  return `${ffCSS}\n\n${wkCSS}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Apply (or re-apply) unified scrollbar styles.
 *
 * @param {Partial<typeof DEFAULT_OPTIONS>} userOptions
 */
function apply(userOptions) {
  if (!isBrowser()) {
    console.warn('[unified-scrollbar] Non-browser environment detected. Skipping style injection.');
    return;
  }
  const opts = mergeOptions(DEFAULT_OPTIONS, userOptions || {});
  const css = buildCSS(opts);
  inject(css);
}

/**
 * Inject raw CSS string into the document <head>.
 * Replaces any previously injected unified-scrollbar style.
 *
 * @param {string} css
 */
function inject(css) {
  if (!isBrowser()) return;
  removeExistingStyle();

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.setAttribute('data-unified-scrollbar', '1');
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * Remove unified scrollbar styles from the document.
 */
function remove() {
  removeExistingStyle();
}

/**
 * Generate the CSS string without injecting it (useful for SSR / frameworks).
 *
 * @param {Partial<typeof DEFAULT_OPTIONS>} userOptions
 * @returns {string}
 */
function generateCSS(userOptions) {
  const opts = mergeOptions(DEFAULT_OPTIONS, userOptions || {});
  return buildCSS(opts);
}

/**
 * Get current default options (read-only copy).
 *
 * @returns {typeof DEFAULT_OPTIONS}
 */
function getDefaults() {
  return Object.assign({}, DEFAULT_OPTIONS);
}

// ─── Preset Themes ────────────────────────────────────────────────────────────

const THEMES = {
  /** Default – subtle gray */
  default: {},

  /** Dark background friendly */
  dark: {
    thumbColor: 'rgba(255,255,255,0.25)',
    thumbHoverColor: 'rgba(255,255,255,0.45)',
    thumbActiveColor: 'rgba(255,255,255,0.65)',
    trackColor: 'rgba(255,255,255,0.05)',
    trackHoverColor: 'rgba(255,255,255,0.1)',
    firefoxScrollbarColor: 'rgba(255,255,255,0.25) rgba(255,255,255,0.05)',
  },

  /** Minimal – almost invisible until hover */
  minimal: {
    width: '4px',
    height: '4px',
    thumbColor: 'rgba(0,0,0,0.2)',
    thumbHoverColor: 'rgba(0,0,0,0.5)',
    thumbActiveColor: 'rgba(0,0,0,0.7)',
    trackColor: 'transparent',
    borderRadius: '2px',
    firefoxScrollbarWidth: 'thin',
  },

  /** macOS style */
  macos: {
    width: '10px',
    height: '10px',
    thumbColor: 'rgba(0,0,0,0.3)',
    thumbHoverColor: 'rgba(0,0,0,0.5)',
    thumbActiveColor: 'rgba(0,0,0,0.7)',
    trackColor: 'transparent',
    borderRadius: '5px',
    thumbBorder: '2px solid transparent',
    thumbBoxShadow: 'inset 0 0 0 10px rgba(0,0,0,0.3)',
    firefoxScrollbarWidth: 'thin',
  },

  /** Rounded pastel – soft UI */
  soft: {
    width: '8px',
    height: '8px',
    thumbColor: '#c4b5fd',
    thumbHoverColor: '#a78bfa',
    thumbActiveColor: '#7c3aed',
    trackColor: '#f5f3ff',
    trackHoverColor: '#ede9fe',
    borderRadius: '4px',
    firefoxScrollbarColor: '#c4b5fd #f5f3ff',
  },

  /** Neon – vibrant dark */
  neon: {
    width: '6px',
    height: '6px',
    thumbColor: '#00f5ff',
    thumbHoverColor: '#00c8ff',
    thumbActiveColor: '#0099ff',
    trackColor: '#0a0a0a',
    trackHoverColor: '#111',
    borderRadius: '3px',
    thumbBoxShadow: '0 0 6px #00f5ff88',
    firefoxScrollbarColor: '#00f5ff #0a0a0a',
  },

  /** Hidden – completely transparent */
  hidden: {
    width: '0px',
    height: '0px',
    thumbColor: 'transparent',
    trackColor: 'transparent',
    firefoxScrollbarWidth: 'none',
  },
};

/**
 * Apply a named preset theme with optional overrides.
 *
 * @param {keyof THEMES} themeName
 * @param {Partial<typeof DEFAULT_OPTIONS>} overrides
 */
function applyTheme(themeName, overrides) {
  const theme = THEMES[themeName];
  if (!theme) {
    console.warn(`[unified-scrollbar] Unknown theme: "${themeName}". Available: ${Object.keys(THEMES).join(', ')}`);
    return;
  }
  apply(mergeOptions(theme, overrides || {}));
}

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  apply,
  applyTheme,
  inject,
  remove,
  generateCSS,
  getDefaults,
  themes: THEMES,
  DEFAULT_OPTIONS,
  version: '1.0.0',
};
