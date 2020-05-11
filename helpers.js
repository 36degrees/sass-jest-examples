const util = require('util')

const sass = require('node-sass')

module.exports.render = (options) => {
  return util.promisify(sass.render)({
    includePaths: ['./sass'],
    ...options
  })
}
