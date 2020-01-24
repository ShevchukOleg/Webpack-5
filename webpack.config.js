const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const isDevelopment = process.env.NODE_ENV === 'development';
console.log("Development:", isDevelopment);

// Використання оптимізацій коду при ствроренні бандлу в продакшн
function optimization() {
  const optimizationOptions = {
    splitChunks: {
      chunks: "all"
    }
  };
  if (!isDevelopment) {
    optimizationOptions.minimizer = [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
  return optimizationOptions
}
// Автоматична підстановка потрібного типу імені файлу
function filenameHashConfig(ext) {
  return isDevelopment ? `[name].${ext}` : `[name]-[hash].${ext}`;
}

// конфігурує роботу лодерів обробки стилів
function stylesLoadersConfig(mainLoader) {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDevelopment,
        reloadAll: true
      }
    },
    'css-loader'
  ]

  if(mainLoader) {
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
//   if (isDevelopment) {
//     loaders.push()
//   }
// }

// керування плагінами
function plugins() {
  const basePlagins = [
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

    new MiniCssExtractPlugin({ filename: filenameHashConfig("css") }),
    new CopyPlugin([
      { from: path.resolve(__dirname, './src/assets/icons'), to: path.resolve(__dirname, './dist/assets/icons') },
    ]),
  ];

  if(!isDevelopment) {
    basePlagins.push(new BundleAnalyzerPlugin())
  }

  return basePlagins;
}
// об'экт налаштувань WEBpack
module.exports = {
  context: path.resolve(__dirname, 'src'),
  // точка входу у вигляді об'єкту з основним скриптом у який імпортяться модулі та окремо бібліотеки
  entry: {
    main: ['@babel/polyfill', './js/app.js'],
    libs: ['./js/libs/lib_1.js']
  },
  // вивід результату
  output: {
    filename: filenameHashConfig("js"),
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
        test: /\.css$/,
        use: stylesLoadersConfig(),
      },
      {
        test: /\.s[ac]ss$/i,
        use: stylesLoadersConfig('sass-loader'),
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

  optimization: optimization(),

  devtool: isDevelopment ? 'source-map' : '',

  plugins: plugins(),

  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    hot: isDevelopment
  },
};
