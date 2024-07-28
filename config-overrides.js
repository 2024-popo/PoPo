const { override, addWebpackAlias, addWebpackModuleRule } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    ['@']: path.resolve(__dirname, 'src'),
  }),
  addWebpackModuleRule({
    test: /\.scss$/,
    use: [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          sourceMap: true,
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          sourceMap: true,
        },
      },
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: true,
        },
      },
      {
        loader: require.resolve('sass-loader'),
        options: {
          sourceMap: true,
        },
      },
    ],
  })
);
