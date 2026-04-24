// ============================================================
// theme/index.ts — export tất cả theme tokens
// Import từ đây trong toàn bộ app
// ============================================================
export { facebookColors, colors } from './colors';

import { colors } from './colors';

export const theme = {
  colors,
  spacing: {
    xs: '0.25rem', sm: '0.5rem', md: '1rem',
    lg: '1.5rem', xl: '2rem', '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.25rem', md: '0.5rem', lg: '0.75rem', xl: '1rem', full: '9999px',
  },
  fontSize: {
    xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
    xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
  },
};

export type Theme = typeof theme;
