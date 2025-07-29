/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const TerserJSPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('staging'),
        GRAPHQL_ENDPOINT: JSON.stringify('https://graphql-dev.synkd.life/'),
        BILLING_FRONTEND: JSON.stringify('https://billing-dev.synkd.life'),
        REACT_APP_INS_ENV: JSON.stringify('staging'),
        REQUEST_TIMEOUT: 40000,
        REACT_APP_STRIPE_PUBLIC_KEY: JSON.stringify('pk_test_51NATcPCx8GDBKZpParWRoG1lifTYR5oOBPuMVCe7qBm4tG87NBid9XzYf4quYOVBcZg11c7ugkygHfycVgJZSl8k00IcTzZ1sy')
      }
    })
  ],
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
})