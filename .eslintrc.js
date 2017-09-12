module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        trailingComma: 'es5',
        singleQuote: true,
      },
    ],
    semi: ['error', 'never'],
    'react/sort-comp': 'off',
  },
  plugins: ['prettier'],
}
