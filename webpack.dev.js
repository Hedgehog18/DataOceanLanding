const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',

  watchOptions: {
    poll: true,
  },

  devtool: 'inline-source-map',

  devServer: {
    port: 9000,
    hot: true,
    open: true,
  }
});
