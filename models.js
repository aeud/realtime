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
            dataType: 'varchar(64)'
        }, {
            name: 'local_variant_id',
            dataType: 'integer'
        }, {
            name: 'account',
            dataType: 'varchar(20)'
        }, {
            name: 'product_name',
            dataType: 'varchar(255)'
        }, {
            name: 'brand_name',
            dataType: 'varchar(255)'
        }, {
            name: 'variant_name',
            dataType: 'varchar(255)'
        }, {
            name: 'price',
            dataType: 'float'
        }, {
            name: 'image_url',
            dataType: 'varchar(255)'
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