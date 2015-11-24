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

var lastOrders = []

app.set('trust proxy', true)

app.get('/collect', (req, res) => {
    res.sendFile(__dirname + '/pixel.gif')
    io.emit('order', 'event')
})

app.get('/', basicAuth.auth('sephora', 'live'), (req, res) => {
    res.sendFile(__dirname + '/bf.html')
})

io.on('connection', socket => {
    socket.emit('init', lastOrders)
})

http.listen(3000, () => {
    console.log('listening on localhost:3000')
})