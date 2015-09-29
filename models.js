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
        }, {
            name: 'local_variant_id',
            dataType: 'integer'
        }, {
            name: 'account',
            dataType: 'varchar(20)'
        }
    ]
})

exports.geoIp = sql.define({
    name: 'geo_ips',
    schema: 'realtime',
    columns: [
        {
            name: 'ip',
            dataType: 'varchar(16)',
            primary_key: true
        }, {
            name: 'latitude',
            dataType: 'numeric'
        }, {
            name: 'longitude',
            dataType: 'numeric'
        }
    ]
})