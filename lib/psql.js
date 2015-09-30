var pg = require('pg')
var parameters = require('../parameters.json')
var conString = parameters.psql.conString

exports.query = (query, callback) => {
    pg.connect(conString, (err, client, done) => {
        if (err) console.error(err)
        client.query(query, (err, resp) => {
            if (err) console.error(err)
            done()
            if (typeof callback != 'undefined') callback(err, resp)
        })
    })
}