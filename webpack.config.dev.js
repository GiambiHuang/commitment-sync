const path = require('path');
const webpack = require('webpack');

const config = {
  mode: 'production',
  entry: './src/index.ts',
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({ test: /.min.js$/ }),
  //   ],
  // },
  externals: "findora-wallet-wasm/web-lightweight",
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-typescript'],
        },
      },
    ],
  },
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, 'public/js'),
    publicPath: "./js/",
    library: {
      name: 'commitment-sync',
      type: 'umd',
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      __IN_LOCAL__: true
    }),
  ],
  devtool: 'source-map',
};
 
module.exports = config
