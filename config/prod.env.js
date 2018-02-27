module.exports = {
  NODE_ENV: '"production"',
  SEND_STATISTICS: true,
  DEV_WEBSITE: process.env.GIT_BRANCH !== 'origin/master',
  COMMIT_NUMBER: JSON.stringify(process.env.GIT_COMMIT)
}
