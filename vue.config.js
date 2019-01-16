
// this BASE_URL will be set in the different jenkins plans
/* eslint-disable no-undef */
const webpack = require('webpack')

console.log('Base URL:', process.env.BASE_URL)
console.log('Commit:', process.env.GIT_COMMIT)
console.log('Branch:', process.env.GIT_BRANCH)

module.exports = {
  baseUrl: process.env.BASE_URL,
  configureWebpack: {
    module: {
      rules: [
        { test: /\.md$/, use: ["html-loader", "markdown-loader"] }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'GIT_COMMIT': JSON.stringify(process.env.GIT_COMMIT),
          'GIT_BRANCH': JSON.stringify(process.env.GIT_BRANCH)
        }
      }),
    ],
  }
}
