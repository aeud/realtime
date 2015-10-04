var names = require('./names.json')
var md5   = require('md5')

exports.generate = (id) => names[parseInt(md5(id).substr(0,4), 16) % names.length]