/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack')
const merge = require('webpack-merge')
// const fs = require('fs')
const common = require('./webpack.common.js')
// empty commit to test
module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // API_ENDPOINT: JSON.stringify('https://events-local.byinspired.com'),
        API_ENDPOINT: JSON.stringify('/api'),
        GRAPHQL_ENDPOINT: JSON.stringify('/graphql'),
        REACT_APP_INS_ENV: JSON.stringify('staging'),
        // Origin: JSON.stringify('test.events.byinspired.com'),
        REQUEST_TIMEOUT: 40000,
        TEST_EVENT_ID: JSON.stringify('test'),
        LBI_LOGIN_URL: JSON.stringify('https://localhost/'),
        //you might have to try browsers like firefox to bypass issues with iframing in marketing/events        
        BILLING_FRONTEND: JSON.stringify('http://localhost:3001'),
        //BILLING_FRONTEND: JSON.stringify('https://billing-dev.synkd.life'),
        // REACT_APP_STRIPE_PUBLIC_KEY: JSON.stringify('pk_test_51IPi3ECaIbpWGtXJNdmCgVaRo5uoUAY6xv2fzIpFCkB62RsKHHExmUD1jxmPNTMSPPq84XIWWIUwgD3CL5aoeK2a00Ra9QrNUP')
        REACT_APP_STRIPE_PUBLIC_KEY: JSON.stringify('pk_test_51NATcPCx8GDBKZpParWRoG1lifTYR5oOBPuMVCe7qBm4tG87NBid9XzYf4quYOVBcZg11c7ugkygHfycVgJZSl8k00IcTzZ1sy')
      }
    })
  ],
  devServer: {
    // https: {
    //   key: fs.readFileSync('/usr/local/etc/nginx/byinspiredssl/priv.key'),
    //   cert: fs.readFileSync('/usr/local/etc/nginx/byinspiredssl/server.crt'),
    //   ca: fs.readFileSync('/usr/local/etc/nginx/byinspiredssl/STAR_byinspired_com.ca-bundle'),
    // },
    contentBase: './dist',
    historyApiFallback: true,
    compress: true,
    disableHostCheck: true,
    https: true,
    proxy: {
      '/api': {
        //target: 'https://localhost:3000',
        target: 'https://api-dev.synkd.life',
        secure: false,
        changeOrigin: true,
        cookieDomainRewrite: '',
        pathRewrite: { '^/api': '' }
      },
      '/graphql': {
        target: 'http://localhost:800',
        // target: 'https://graphql-dev.synkd.life',
        secure: false,
        changeOrigin: true,
        cookieDomainRewrite: '',
        pathRewrite: { '^/graphql': '' }
      }
    }
  }
})
