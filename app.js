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
//var mmdbreader = require('maxmind-db-reader')
//var countries = mmdbreader.openSync(__dirname + '/countries.mmdb')
var sql = require('sql')
sql.setDialect('postgres')
var models = require('./models')
var psql = require('./lib/psql')

var insertEvent = (event, callback) => {
    psql.query(models.event.insert(event).toQuery(), callback)
}

app.get('/collect', (req, res) => {
    var ip = req.ip
    //var geodata = countries.getGeoDataSync('118.189.135.150')
    var event = {
        ip: ip,
        created_at: new Date(),
        visit_id: 'rewrew'
    }
    insertEvent(event, (err, resp) => {
        res.send(resp)
    })
    
})

http.listen(3000, () => {
    console.log('listening on *:3000')
})