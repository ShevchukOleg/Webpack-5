const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// об'экт налаштувань WEBpack
module.exports = {
  context: path.resolve(__dirname, 'src'),
  // точка входу у вигляді об'єкту з основним скриптом у який імпортяться модулі та окремо бібліотеки
  entry: {
    main: './js/jscomponents/app.js',
    libs: ['./js/libs/lib_1.js']
  },
  // вивід результату
  output: {
  filename: '[name].bundle.js',
  // filename: '[name].bundle-[hash].js',
  path: path.resolve(__dirname, 'dist')
  },

  mode: "development",

  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        },
        {
          test: /\.css$/,
          use:
          // [
          //   { loader: 'style-loader'},
          //   { loader: MiniCssExtractPlugin.loader},
          //   { loader: 'css-loader'}
          // ]
          [MiniCssExtractPlugin.loader, 'css-loader'],
        },
    ]
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
      test: /\.js$/,
      exclude: /node_modules/,
      parallel: true,
    })
  ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      title: 'Webpack + scss'
    }),
    new UglifyJsPlugin({
      test: /\.js$/,
      exclude: /node_modules/
    }),
    new MiniCssExtractPlugin( { filename: 'style.css'} )
  ],
};
