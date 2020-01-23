const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
console.log("Development:", isDevelopment);

// об'экт налаштувань WEBpack
module.exports = {
  context: path.resolve(__dirname, 'src'),
  // точка входу у вигляді об'єкту з основним скриптом у який імпортяться модулі та окремо бібліотеки
  entry: {
    main: './js/app.js',
    libs: ['./js/libs/lib_1.js']
  },
  // вивід результату
  output: {
    filename: '[name].bundle-[hash].js',
    // filename: '[name].bundle-[hash].js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    extensions: ['.js', '.json', '.jpg', '.png',],
    alias: {
      '@components': path.resolve(__dirname, './src/js/jscomponents'),
      '@': path.resolve(__dirname, './src')

    }
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
        use: [
            {loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDevelopment,
              reloadAll: true
              }
            },
            'css-loader'
          ],
      },
      {
        test: /.(png|jpg|gif|svg)$/,
        use: ['file-loader']
      },
      {
        test: /.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      }
    ]
  },

  optimization: {

    splitChunks: {
      chunks: "all"
      },

    minimizer: [
      new UglifyJsPlugin({
        test: /\.js$/,
        exclude: /node_modules/,
        parallel: true,
      })
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    //! Цей плагін модифікує тайтл сайту!!!
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      title: 'Webpack + scss',
      minify: {
        collapseWhitespace: !isDevelopment
      }

    }),
    new UglifyJsPlugin({
      test: /\.js$/,
      exclude: /node_modules/
    }),
    new MiniCssExtractPlugin({ filename: 'style.css' }),
    new CopyPlugin([
      { from: path.resolve(__dirname, './src/assets/icons'), to: path.resolve(__dirname, './dist/assets/icons') },
      // { from: 'other', to: 'public' },
    ]),
  ],

  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    hot: isDevelopment
  },
};
