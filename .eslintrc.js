module.exports = {
  'ecmaFeatures': {
    'modules': true,
    'spread': true,
    'restParams': true
  },
  'env': {
    'browser': true,
    'node': true,
    'es6': true
  },
  'rules': {
    'no-unused-vars': 2,
    'no-undef': 2,
  },
  'parser': 'babel-eslint',
  'parserOptions': {
    'sourceType': 'module'
  },
  'extends': 'eslint:recommended'
}
