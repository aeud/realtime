var pg = require('pg')
var conString = 'postgres://postgres:root@localhost/mike'

exports.query = (query, callback) => {
    pg.connect(conString, (err, client, done) => {
        if (err) throw err
        client.query(query, (err, resp) => {
            if (err) throw err
            done()
            if (typeof callback != 'undefined') callback(err, resp)
        })
    })
}