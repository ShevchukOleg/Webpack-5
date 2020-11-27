const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const isDev = process.env.NODE_ENV === 'development';
console.log("Development:", isDev);

// Використання оптимізацій коду при ствроренні бандлу в продакшн
function optimization() {
  const optimizationOptions = {
    splitChunks: {
      chunks: "all"
    }
  };
  if (!isDev) {
    optimizationOptions.minimizer = [
      new CssMinimizerPlugin(),
      new TerserJSPlugin({}),
      // new OptimizeCSSAssetsPlugin({}),

    ]
  }
  return optimizationOptions
}
// Автоматична підстановка потрібного типу імені файлу
function filenameHashConfig(ext) {
  return isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
}

// конфігурує роботу лодерів обробки стилів
function stylesLoadersConfig(mainLoader) {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        // hmr: true,
        publicPath: (resourcePath, context) => {
          return path.relative(path.dirname(resourcePath), context) + '/';
        },
      },
    },
    'css-loader'
  ]

  if (mainLoader) {
    loaders.push(mainLoader);
  }

  return loaders;
}

//Управління eslint
// function jsLoaders() {
//   const loaders = [
//     {loader: 'babel-loader',
//       options: {
//         presets: ['@babel/preset-env'],
//         plugins: ['@babel/plugin-proposal-class-properties']
//       }
//     }
//   ]
//   if (isDev) {
//     loaders.push()
//   }
// }

// керування плагінами
function plugins() {
  const basePlagins = [
    // Видаляє непотрібні фали попередніх бандлів
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    //! Цей плагін модифікує тайтл сайту!!!
    new HtmlWebpackPlugin({
      // template: 'src/index.html',
      template: path.resolve(__dirname, './src/index.html'),
      // filename: './index.html',
      title: isDev ? 'Dev' : 'Webpack5 bundle',
      minify: {
        collapseWhitespace: !isDev,
        removeComments: !isDev,
      }
    }),

    new MiniCssExtractPlugin({ filename: filenameHashConfig("css") }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, './src/assets'), to: path.resolve(__dirname, './dist/assets') },
      ]
    }),
    // new webpack.HotModuleReplacementPlugin(),
  ];

  if (!isDev) {
    basePlagins.push(new BundleAnalyzerPlugin())
  }
  // Якщо використовуємо webpack-dev-server активація HMR не потрібна
  // else {
  //   plugins.push(new webpack.HotModuleReplacementPlugin());
  // }

  return basePlagins;
}
// об'экт налаштувань WEBpack
module.exports = {
  context: path.resolve(__dirname, 'src'),
  // визнечення базового режиму роботи
  mode: "development",
  // точка входу у вигляді об'єкту з основним скриптом у який імпортяться модулі та окремо бібліотеки
  entry: {
    main: ['@babel/polyfill', './js/app.js'],
    libs: ['./js/libs/lib_1.js']
  },
  // вивід результату
  output: {
    filename: filenameHashConfig("js"),
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]'
  },

  resolve: {
    extensions: ['.js', '.json', '.jpg', '.png',],
    alias: {
      '@components': path.resolve(__dirname, './src/js/jscomponents'),
      '@': path.resolve(__dirname, './src')

    }
  },


  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.css$/i,
        use: stylesLoadersConfig(),
      },
      {
        test: /\.s[ac]ss$/i,
        use: stylesLoadersConfig('sass-loader'),
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        // use: ['file-loader']
      },
      {
        test: /.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
        // use: ['file-loader']
      }
    ]
  },

  optimization: optimization(),

  // devtool: isDev ? 'source-map' : '',
  devtool: 'inline-source-map',

  plugins: plugins(),

  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    hot: true,
    open: true,
  },
};
