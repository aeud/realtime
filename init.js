var sql = require('sql')
sql.setDialect('postgres')
var models = require('./models')
var psql = require('./lib/psql')
var async = require('async')

async.series([
    c => psql.query(models.event.drop().ifExists().toQuery(), c),
    c => psql.query(models.event.create().toQuery(), c)
], (err, resp) => {
    if (err) throw err
    console.log(resp)
})
