const path = require('path');
// const webpack = require('webpack');

const config = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
  },
  externals: "findora-wallet-wasm/bundler/wasm.js",
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
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: "./",
    library: {
      name: 'commitment-sync',
      type: 'umd',
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // plugins: [
  //   new webpack.DefinePlugin({
  //     __IN_LOCAL__: false
  //   }),
  // ],
  devtool: 'source-map',
};
 
module.exports = config
