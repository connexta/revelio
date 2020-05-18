const schemaJson = require('./schema')

const graphqlRules = () => {
  return {
    'graphql/template-strings': [
      'error',
      {
        env: 'apollo',
        schemaJson,
      },
    ],
    'graphql/named-operations': [
      'error',
      {
        schemaJson,
      },
    ],
  }
}

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'import', 'graphql'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    ...graphqlRules(),
  },
  ignorePatterns: ['node_modules/', 'target/', 'public/Cesium/'],
}
