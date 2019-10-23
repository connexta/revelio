const { genSchema } = require('./src/main/webapp/intrigue-api/gen-schema')

const graphqlRules = () => {
  const schemaString = genSchema()

  return {
    'graphql/template-strings': [
      'error',
      {
        env: 'apollo',
        schemaString,
      },
    ],
    'graphql/named-operations': [
      'error',
      {
        schemaString,
      },
    ],
  }
}

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
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
    'import/ignore': [
      '@connexta',
      // TODO: Remove this
      'intrigue-api',
    ],
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
}
