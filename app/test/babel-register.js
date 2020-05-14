// Necessary because babel register ignores extensions in mocharc
// https://github.com/babel/babel/issues/8962#issuecomment-443135379
const register = require('@babel/register').default

register({ extensions: ['.ts', '.tsx', '.js'] })
