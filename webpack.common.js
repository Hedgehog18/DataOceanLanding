const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './index.js',
    error: './errorScripts.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].[contenthash].bundle.js",
    publicPath: '',
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].bundle.css',
      chunkFilename: '[id].[contenthash].bundle.css',
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new webpack.ProvidePlugin({ $: 'jquery' }),
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: "index.html",
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './404.html',
      filename: "404.html",
      chunks: ['error'],
    }),
    new HtmlWebpackPlugin({
      template: './500.html',
      filename: "500.html",
      chunks: ['error'],
    }),
    new CopyPlugin({
      patterns: [
        { from: "./img", to: path.resolve(__dirname, 'dist/img') },
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|woff|woff2|svg|eot|ttf|gif|jpe?g)$/,
        use: ['file-loader'],
      },
    ],
  },
};
