console.log('process.env', process.env)
module.exports = {
  NODE_ENV: '"production"',
  SEND_STATISTICS: true
  DEV_WEBSITE: process.env.TRAVIS_BRANCH !== 'master',
  TRAVIS_COMMIT: JSON.stringify(process.env.TRAVIS_COMMIT),
  TRAVIS_COMMIT_MESSAGE: JSON.stringify(process.env.TRAVIS_COMMIT_MESSAGE)
}
