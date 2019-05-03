const DEVELOPMENT = 'development';
const PRODUCTION = 'production';
const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const argv = require('minimist')(process.argv.slice(2));

/**
 * Returns the resolved path based on the environment used in the command line in terminal.
 *
 * @param {string} environment
 */
const getPath = environment => {
  switch (environment) {
    case DEVELOPMENT:
      return path.resolve('./.env.development');
    case PRODUCTION:
      return path.resolve('./.env.production');
    default:
      return path.resolve('./.env');
  }
};

module.exports = function override(config) {
  const path = getPath(argv.env);
  const env = dotenv.config({ path });

  const envVariables = env.error
    ? {}
    : Object.keys(env.parsed).reduce(
        (acc, key) => ({
          ...acc,
          [key]: JSON.stringify(env.parsed[key]),
        }),
        {}
      );

  const envPlugin = new webpack.DefinePlugin({
    'process.env': JSON.stringify(process.env.NODE_ENV),
    ...envVariables,
  });

  config.plugins.push(envPlugin);

  return config;
};
