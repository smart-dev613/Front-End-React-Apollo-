/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')
const CopyPlugin = require('copy-webpack-plugin'); // Import CopyWebpackPlugin

module.exports = {
  entry: {
    main: ['babel-polyfill', './src/index.tsx'],
    //notification: './src/notification.js' // Add notification.js as an entry point
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
        options: {
          reportFiles: [
            'src/**/*.{ts,tsx}'
          ]
        }
      },
      // to recognise .mjs files in the complier
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/, // For sass
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpg|png|gif|svg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './images/'
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './styles/fonts/'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
    alias: {
      images: path.resolve(__dirname, 'src/assets/images/')
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: '[name].[chunkhash].bundle.js'
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name (module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `vendor.${packageName.replace('@', '')}`
          }
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Events by Inspired',
      template: './src/index.html',
      favicon: 'src/assets/images/favicon.ico'
    }),
    new CheckerPlugin(),
    new CopyPlugin([ // Correctly structured options array
        { from: './src/notification.js', to: path.resolve(__dirname, 'dist/notification.js')} // Copy notification.js to dist
    ])
  ]
}