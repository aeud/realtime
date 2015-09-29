var app = require('express')()
var http = require('http').Server(app)
var sql = require('sql')
sql.setDialect('postgres')
var models = require('./models')
var psql = require('./lib/psql')
var io = require('socket.io')(http)
var ipInfo = require('./lib/ip-info')

var insertEvent = (event, callback) => {
    psql.query(models.event.insert(event).toQuery(), callback)
}

var insertIp = (ip, callback) => {
    var geoIp = models.geoIp
    psql.query(geoIp.select(geoIp.star()).from(geoIp).where(geoIp.ip.equals(ip)).toQuery(), (err, resp) => {
        if (!err && resp.rows.length == 0) {
            ipInfo.getInfo(ip, (err, resp) => {
                var geoIpInstance = {
                    ip: ip,
                    latitude: resp.latitude,
                    longitude: resp.longitude
                }
                if (typeof callback != 'undefined') callback(err, geoIpInstance)
                psql.query(geoIp.insert(geoIpInstance).toQuery())
            })
        } else if (typeof callback != 'undefined'){
            if (err) callback(err)
            else callback(null, resp.rows.length > 0 ? resp.rows[0] : null)
        }
    })
}

var images = [
    'http://s3.lximg.com/images/pictures/12209/featured_f809e3206785594300de5e299aef02cf7f558e12_1442475292_FM03_THE-POREFESSIONAL-AGENT-ZERO-SHINE_WEB.jpg',
    'http://s3.lximg.com/images/pictures/1620/featured_8da5968ab8d33c574e5804153fe768d0866f4ca9_juliehewett_bijou_lulu.png',
    'http://s0.lximg.com/images/pictures/7169/featured_1bc15ed252df8252bbbd848d47e1514112d5b1ca_1412655845_MRS_Secret_20Weapon_2024Hr_20Mascara-purple.jpg',
    'http://s3.lximg.com/images/pictures/6178/featured_30960beb1f42efcb2f0746ae1cac0067c24855b7_1408958812_Micro_Polish_Cleanser_100ml_update.jpg',
    'http://s2.lximg.com/images/pictures/7872/featured_358318594f6367c1267e0be3be13db13a59be913_1415269156_pink-elements-complete-eye-set-l.jpg'
]
var i = 0;

app.set('trust proxy', true)

app.get('/collect', (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    ip = /(\d){1,3}\.(\d){1,3}\.(\d){1,3}\.(\d){1,3}/.test(ip) ? ip : '118.189.135.150';
    var visitId = req.query.vid || 'unknown'
    var variantId = req.query.variant && /^\d+$/g.test(req.query.variant) ? req.query.variant : null
    var account = req.query.a && /^(default|indonesia|thailand)$/g.test(req.query.a) ? req.query.a : null
    res.sendFile(__dirname + '/pixel.gif')
    var event = {
        ip: ip,
        created_at: new Date(),
        visit_id: visitId,
        local_variant_id: variantId,
        account: account,
    }
    if (variantId && account) {
        insertEvent(event, (err, resp) => {
            insertIp(ip, (err, resp) => {
                console.log(resp)
                io.emit('message', { c: [50, parseInt(100 * Math.random())] })
            })
        })
    }  
})

app.get('', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => socket.emit('init', [
    { c: [parseInt(20 * Math.random()), parseInt(100 * Math.random())], image: images[i++ % images.length]  },
    { c: [parseInt(20 * Math.random()), parseInt(100 * Math.random())], image: images[i++ % images.length]  },
    { c: [parseInt(20 * Math.random()), parseInt(100 * Math.random())], image: images[i++ % images.length]  },
    { c: [parseInt(20 * Math.random()), parseInt(100 * Math.random())], image: images[i++ % images.length]  },
    { c: [parseInt(20 * Math.random()), parseInt(100 * Math.random())], image: images[i++ % images.length]  },
    { c: [parseInt(20 * Math.random()), parseInt(100 * Math.random())], image: images[i++ % images.length]  },
    { c: [parseInt(20 * Math.random()), parseInt(100 * Math.random())], image: images[i++ % images.length]  },
]));

http.listen(3000, () => {
    console.log('listening on *:3000')
})

setInterval(x => io.emit('message', {
    c: [parseInt(20 * Math.random()), parseInt(100 * Math.random())],
    image: images[i++ % images.length]
}), 5000)