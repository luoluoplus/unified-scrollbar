# unified-scrollbar

[![npm version](https://img.shields.io/npm/v/unified-scrollbar.svg?style=flat-square)](https://www.npmjs.com/package/unified-scrollbar)
[![npm downloads](https://img.shields.io/npm/dm/unified-scrollbar.svg?style=flat-square)](https://www.npmjs.com/package/unified-scrollbar)
[![license](https://img.shields.io/npm/l/unified-scrollbar.svg?style=flat-square)](./LICENSE)
[![zero deps](https://img.shields.io/badge/deps-zero-brightgreen?style=flat-square)](./package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue?style=flat-square)](./dist/index.d.ts)

> **One line of code** to unify and customize scrollbar styles across your entire web project.  
> Supports Chrome, Safari, Edge, Firefox, and all major browsers. Zero dependencies.

---

## Features

- 🎨 **6 built-in themes** — default, dark, minimal, macOS, soft, neon, hidden
- ⚙️ **Fully customizable** — width, color, radius, border, shadow, and more
- 🌐 **Cross-browser** — WebKit + Firefox (scrollbar-color / scrollbar-width)
- 🎯 **Flexible targeting** — global, body, or any CSS selector
- 🏗️ **SSR friendly** — `generateCSS()` returns a string, no DOM required
- 📦 **ESM + CJS + UMD** — works everywhere
- 💪 **TypeScript** — full type declarations included
- 0️⃣ **Zero dependencies**

---

## Installation

```bash
npm install unified-scrollbar
# or
yarn add unified-scrollbar
# or
pnpm add unified-scrollbar
```

---

## Quick Start

```js
import UnifiedScrollbar from 'unified-scrollbar';

// Apply default scrollbar globally — ONE LINE!
UnifiedScrollbar.apply();
```

That's it. Every scrollbar in your project is now unified. ✅

---

## Usage

### ESM / TypeScript

```ts
import UnifiedScrollbar from 'unified-scrollbar';
import { apply, applyTheme, remove, generateCSS } from 'unified-scrollbar';

// Default gray theme
UnifiedScrollbar.apply();

// Preset theme
UnifiedScrollbar.applyTheme('dark');

// Custom options
UnifiedScrollbar.apply({
  width: '10px',
  thumbColor: '#7c6dfa',
  thumbHoverColor: '#a78bfa',
  trackColor: 'rgba(0,0,0,0.1)',
  borderRadius: '5px',
});

// Target only a specific element
UnifiedScrollbar.apply({ target: '#sidebar' });

// Remove styles
UnifiedScrollbar.remove();
```

### CommonJS

```js
const UnifiedScrollbar = require('unified-scrollbar');
UnifiedScrollbar.apply();
UnifiedScrollbar.applyTheme('macos');
```

### CDN (no bundler)

```html
<script src="https://cdn.jsdelivr.net/npm/unified-scrollbar/dist/index.umd.js"></script>
<script>
  UnifiedScrollbar.apply();
  // or
  UnifiedScrollbar.applyTheme('neon');
</script>
```

### CSS only (no JS needed)

```css
/* In your CSS file */
@import 'unified-scrollbar/css';
```

```js
// Or import in JS/TS
import 'unified-scrollbar/style.css';
```

### Next.js / SSR

```tsx
// pages/_app.tsx
import { useEffect } from 'react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import('unified-scrollbar').then(m => m.default.applyTheme('dark'));
  }, []);
  return <Component {...pageProps} />;
}
```

```ts
// Server-side CSS generation (no DOM needed)
import { generateCSS } from 'unified-scrollbar';
const css = generateCSS({ thumbColor: '#7c6dfa', width: '10px' });
// Inject css into <style> tag via your SSR framework
```

### Vue 3

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import UnifiedScrollbar from 'unified-scrollbar';

UnifiedScrollbar.applyTheme('soft');
createApp(App).mount('#app');
```

### React (app entry)

```tsx
// index.tsx / main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UnifiedScrollbar from 'unified-scrollbar';

UnifiedScrollbar.apply({ thumbColor: '#6366f1', borderRadius: '6px' });

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

---

## Preset Themes

| Theme     | Description                        |
|-----------|------------------------------------|
| `default` | Subtle gray — works everywhere     |
| `dark`    | Semi-transparent white for dark UIs|
| `minimal` | Tiny 4px, almost invisible         |
| `macos`   | Mimics native macOS scrollbars     |
| `soft`    | Pastel purple, rounded             |
| `neon`    | Cyan glow for dark/cyberpunk UIs   |
| `hidden`  | Completely invisible scrollbar     |

```js
UnifiedScrollbar.applyTheme('neon');

// Override theme options
UnifiedScrollbar.applyTheme('dark', { width: '12px' });
```

---

## API Reference

### `apply(options?)`

Apply unified scrollbar styles to the document. Replaces any previously applied styles.

```ts
apply(options?: ScrollbarOptions): void
```

### `applyTheme(themeName, overrides?)`

Apply a named preset theme with optional overrides.

```ts
applyTheme(themeName: 'default' | 'dark' | 'minimal' | 'macos' | 'soft' | 'neon' | 'hidden', overrides?: ScrollbarOptions): void
```

### `generateCSS(options?)`

Generate the CSS string without injecting it. Perfect for SSR.

```ts
generateCSS(options?: ScrollbarOptions): string
```

### `inject(css)`

Inject a raw CSS string (advanced use case).

### `remove()`

Remove all unified-scrollbar styles from the document.

### `getDefaults()`

Returns a copy of the default options object.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | `string` | `'8px'` | Scrollbar track width (vertical) |
| `height` | `string` | `'8px'` | Scrollbar track height (horizontal) |
| `thumbColor` | `string` | `'#888'` | Thumb color |
| `thumbHoverColor` | `string` | `'#555'` | Thumb hover color |
| `thumbActiveColor` | `string` | `'#333'` | Thumb active/click color |
| `trackColor` | `string` | `'transparent'` | Track background |
| `trackHoverColor` | `string` | `'rgba(0,0,0,0.05)'` | Track hover background |
| `borderRadius` | `string` | `'4px'` | Thumb border-radius |
| `target` | `string` | `'global'` | `'global'` \| `'body'` \| CSS selector |
| `scrollbarGutter` | `string` | `'auto'` | CSS `scrollbar-gutter` value |
| `firefoxScrollbarColor` | `string\|null` | `null` | Firefox `scrollbar-color` override |
| `firefoxScrollbarWidth` | `string` | `'auto'` | Firefox `scrollbar-width` |
| `thumbBorder` | `string` | `'none'` | CSS border on the thumb |
| `thumbBoxShadow` | `string` | `'none'` | CSS box-shadow on the thumb |
| `trackBorderRadius` | `string` | `'0'` | Track border-radius |
| `trackBorder` | `string` | `'none'` | CSS border on the track |
| `thumbTransition` | `string` | `'background 0.2s ease'` | Thumb transition animation |

---

## Browser Support

| Browser | Support | Method |
|---------|---------|--------|
| Chrome / Edge / Opera | ✅ Full | `::-webkit-scrollbar` |
| Safari | ✅ Full | `::-webkit-scrollbar` |
| Firefox | ✅ Full | `scrollbar-color` + `scrollbar-width` |
| IE 11 | ⚠️ Partial | Falls back to native style |

---

## License

MIT © unified-scrollbar contributors
