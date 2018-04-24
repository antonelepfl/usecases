
module.exports = {
  configureWebpack: {
    module: {
      rules: [
        { test: /\.md$/, use: ["html-loader", "markdown-loader"] }
      ]
    }
  }
}
