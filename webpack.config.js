const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Tambahkan resolve.fallback untuk crypto
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
  };

  if (config.mode === 'production') {
    // Disable source map generation
    config.devtool = false;
  }

  return config;
};
