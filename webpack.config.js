const path = require('path');

module.exports = {
  entry: './src/jscr/firebase_mod.js',
  output: {
    path: path.resolve(__dirname, '_dist/jscr'),
    filename: 'firebase_mod.js',
  },
};