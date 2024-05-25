import { type Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', ...fontFamily.sans],
      },
      colors: {
        pink: '#FEB9CC',
        gray: colors.neutral,
      },
    },
  },
  plugins: [],
} satisfies Config;
