import path from 'path';
import { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

const config: Configuration = {
  entry: {
    index: './src/index.ts',
    'index.min': './src/index.ts'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ test: /.min.js$/ }),
    ],
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-typescript'],
        },
      }
    ],
  },
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'umd',
      name: {
        amd: 'commitmentSync',
        commonjs: 'commitmentSync',
        root: 'commitmentSync',
      },
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
};
 
 
export default config;
