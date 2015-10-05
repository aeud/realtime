var app   = require('express')()
var http      = require('http').Server(app)
var sql       = require('sql')
var models    = require('./models')
var psql      = require('./lib/psql')
var io        = require('socket.io')(http)
var ipInfo    = require('./lib/ip-info')
var async     = require('async')
var names     = require('./lib/names')
var basicAuth = require('./lib/basic-auth')

sql.setDialect('postgres')

var insertEvent = (event, callback) => {
    psql.query(models.event.insert(event).toQuery(), callback)
}

var lastEvents = []

var insertIp = (ip, callback) => {
    var geoIp = models.geoIp
    psql.query(geoIp.select(geoIp.star()).from(geoIp).where(geoIp.ip.equals(ip)).toQuery(), (err, resp) => {
        if (!err && resp.rows.length == 0) {
            ipInfo.getInfo(ip, (err, resp) => {
                if (!err && resp && resp.statusCode == 'OK') {
                    var geoIpInstance = {
                        ip: ip,
                        latitude: resp.latitude,
                        longitude: resp.longitude,
                        country: resp.countryName,
                        city: resp.cityName
                    }
                    if (typeof callback != 'undefined') callback(err, geoIpInstance)
                    psql.query(geoIp.insert(geoIpInstance).toQuery())
                } else if (typeof callback != 'undefined') callback('Couldn\'t record the IP')
            })
        } else if (typeof callback != 'undefined'){
            if (err) callback(err)
            else callback(null, resp.rows.length > 0 ? resp.rows[0] : null)
        }
    })
}

app.set('trust proxy', true)

app.get('/collect', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    ip = /(\d){1,3}\.(\d){1,3}\.(\d){1,3}\.(\d){1,3}/.test(ip) ? ip : '118.189.135.150';
    var visitId = req.query.uid || 'unknown'
    var variantId = req.query.vid || null
    var account = req.query.a || null
    var product_name = req.query.p || 'unknown'
    var brand_name = req.query.b || 'unknown'
    var image_url = req.query.i || 'unknown'
    var variant_name = req.query.v || 'unknown'
    var type = req.query.t || 'unknown'
    var price = parseFloat(req.query.psgd || 0)
    res.sendFile(__dirname + '/pixel.gif')
    var event = {
        ip: ip,
        created_at: new Date(),
        visit_id: visitId,
        local_variant_id: variantId,
        account: account,
        product_name: product_name,
        brand_name: brand_name,
        variant_name: variant_name,
        price: price,
        image_url: image_url
    }
    if (/^\d+$/g.test(variantId) && /^(default|indonesia|thailand)$/g.test(account) && /^addtocart$/g.test(type)) {
        insertEvent(event, (err, resp) => {
            insertIp(ip, (err, resp) => {
                if (!err) {
                    event.latitude = resp.latitude
                    event.longitude = resp.longitude
                    event.country = resp.country
                    event.city = resp.city
                    event.name = names.generate(visitId)
                    console.log(event)
                    lastEvents = [event]
                    io.emit('message', event)
                }
            })
        })
    }
})

app.get('/', basicAuth.auth('luxola', 'awesome'), (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
    socket.emit('init', lastEvents)
})

http.listen(3000, () => {
    console.log('listening on localhost:3000')
})