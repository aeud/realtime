//var google = require('googleapis');
//var SERVICE_ACCOUNT_EMAIL = '822776729892-spot4i3pu8idpl2b7579l5efj0v417nk@developer.gserviceaccount.com'
//var SERVICE_ACCOUNT_KEY_FILE = '/Users/adrien/.ssh/lx.pem'
//var auth = new google.auth.JWT(SERVICE_ACCOUNT_EMAIL,SERVICE_ACCOUNT_KEY_FILE,null,['https://www.googleapis.com/auth/analytics'])
//var analytics = google.analytics('v3')
//analytics.data.realtime.get({
//    auth: auth,
//    ids: 'ga:50639087',
//    metrics: 'rt:activeUsers',
//    dimensions: 'rt:latitude,rt:longitude'
//}, function(err, resp){
//    if (err) throw err
//    console.log(resp)
//    console.log(resp.rows.length)
//})

var app = require('express')()
var http = require('http').Server(app)
var pg = require('pg')
var conString = 'postgres://postgres:root@localhost/mike'
var mmdbreader = require('maxmind-db-reader')
var countries = mmdbreader.openSync('/Users/adrien/Downloads/GeoLite2-Country.mmdb')

var client = new pg.Client(conString)
client.connect(err => {
    if (err) throw err
    client.query('select 1', (err, resp) => {
        console.log(resp)
        client.end()
    })
})

app.get('/collect', (req, res) => {
    var ip = req.ip
    var geodata = countries.getGeoDataSync('118.189.135.150')
    res.send(ip)
})

http.listen(3000, () => {
    console.log('listening on *:3000')
})