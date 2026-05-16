module.exports = {
  root: true,
  extends: '@hs-web-team/eslint-config-browser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  plugins: ['react-hooks'],
  rules: {
    // React 17+ new JSX transform — React no longer needs to be in scope
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Vite resolves .js/.jsx extensions automatically — don't require them in imports
    'import/extensions': 'off',

    // JSX inline text: too restrictive for readable markup
    'react/jsx-one-expression-per-line': 'off',

    // Prop types: placeholder components — add prop validation per component when built out
    'react/prop-types': 'off',
  },
  ignorePatterns: ['node_modules/', 'dist/'],
};
