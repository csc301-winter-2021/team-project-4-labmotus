const {removeModuleScopePlugin} = require('customize-cra');
const path = require('path');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app"
  ],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)?$/,
      include: path.resolve(__dirname, '../../'),
      exclude: [path.resolve(__dirname, '../../patient-app'), path.resolve(__dirname, '../../clinician-app')],
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }
      ]
    });
    removeModuleScopePlugin()(config);
    return config;
  },
};
