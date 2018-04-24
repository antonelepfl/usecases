
// this BASE_URL will be set in the different jenkins plans
console.log('Base URL:', process.env.BASE_URL);
module.exports = {
  baseUrl: process.env.BASE_URL,
  configureWebpack: {
    module: {
      rules: [
        { test: /\.md$/, use: ["html-loader", "markdown-loader"] }
      ]
    }
  }
}
