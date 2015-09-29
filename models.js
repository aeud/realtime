var sql = require('sql')

exports.event = sql.define({
    name: 'events',
    schema: 'realtime',
    columns: [
        {
            name: 'visit_id',
            dataType: 'varchar(100)'
        }, {
            name: 'created_at',
            dataType: 'timestamp'
        }, {
            name: 'ip',
            dataType: 'varchar(16)'
        }
    ]
})