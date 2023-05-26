const path = require('path');
const webpack = require('webpack');

const config = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
    // "fetch-worker": "./src/web-worker/fetch.worker.ts",
    // "sync-worker": "./src/web-worker/sync.worker.ts"
  },
  // externals: "findora-wallet-wasm/bundler/wasm.js",
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
    })
  ],
  devtool: 'source-map',
};
 
module.exports = config
