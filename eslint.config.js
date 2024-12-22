import globals from 'globals';
// import pluginJs from '@eslint/js';
// import eslintConfigPrettier from 'eslint-config-prettier';
// const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  // pluginJs.configs.recommended,
  // eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  { ignores: ['/.git', '/.vscode', 'dist/*'] },
];
