// ============================================================
// tokens.ts — src/core/design/tokens.ts
// Single source of truth for all design tokens.
// Import this in tailwind.config.js and anywhere you need raw values.
// ============================================================

// --- Breakpoints (match Tailwind defaults for consistency) ---
export const breakpoints = {
  sm: '640px',   // mobile landscape
  md: '768px',   // tablet
  lg: '1024px',  // desktop small
  xl: '1280px',  // desktop large
  '2xl': '1536px',
} as const;

// --- Z-index scale ---
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
  tooltip: 60,
} as const;

// --- Spacing scale (rem) ---
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

// --- Border radius ---
export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.25rem',
  full: '9999px',
} as const;

// --- Typography scale ---
export const fontSize = {
  xs: ['0.75rem',   { lineHeight: '1rem' }],
  sm: ['0.875rem',  { lineHeight: '1.25rem' }],
  base: ['1rem',    { lineHeight: '1.5rem' }],
  lg: ['1.125rem',  { lineHeight: '1.75rem' }],
  xl: ['1.25rem',   { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
} as const;

// --- Transition presets ---
export const transition = {
  fast: '100ms ease',
  base: '200ms ease',
  slow: '300ms ease',
  bounce: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// --- Shadow scale ---
export const shadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;