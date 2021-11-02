const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  return {
    mode: 'development',
    entry: path.join(__dirname, './examples/index.ts'),
    output: {
      filename: '[hash:8].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'eval-source-map',
    resolve: {
      extensions: ['.ts', '.js', '.json', '.jsx', '.tsx']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'less-loader']
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'tyrojs demo',
        template: path.join(__dirname, './examples/index.html'),
      }),
    ],
    devServer: {
      compress: true,
      host: 'local-ipv4',
      hot: true,
    }
  }
}