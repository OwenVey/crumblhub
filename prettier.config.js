/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  singleQuote: true,
  printWidth: 120,
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-organize-imports'],
};

export default config;
