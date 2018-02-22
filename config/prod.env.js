console.log('process.env', process.env)
module.exports = {
  NODE_ENV: '"production"',
  SEND_STATISTICS: true,
  DEV_WEBSITE: process.env.TRAVIS_BRANCH !== 'master',
  TRAVIS_COMMIT: process.env.TRAVIS_COMMIT
  TRAVIS_COMMIT_MESSAGE: process.env.TRAVIS_COMMIT_MESSAGE
}
