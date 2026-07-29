module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'warn',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/no-mutating-props': 'warn',
    'vue/no-v-html': 'warn',
    'no-unused-vars': 'warn',
    'no-var': 'warn',
    'prefer-const': 'warn',
    'eqeqeq': ['warn', 'always'],
    'curly': ['warn', 'all'],
    'no-empty': 'warn',
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
      },
    },
  ],
};
