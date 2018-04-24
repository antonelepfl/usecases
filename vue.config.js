
// this BASE_URL will be set in the different jenkins plans
console.log('Base URL:', process.env.BASE_URL)
console.log('Commit:', process.env.GIT_COMMIT)
console.log('Branch:', process.env.GIT_BRANCH)
console.log(JSON.stringify(process.env.GIT_COMMIT))
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
