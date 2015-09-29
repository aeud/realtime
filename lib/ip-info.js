var request = require('request')
var key = 'b68a5ae312a5790b38fc231f633f9e189e681bf0efea29129aee12e676ee7752'
var host = 'http://api.ipinfodb.com'
exports.getInfo = (ip, callback) => {
    request(host + '/v3/ip-city/?key=' + key + '&ip=' + ip + '&format=json', (err, resp, body) => {
        if (err) {
            callback(err)
        } else {
            var json = null
            try {
                json = JSON.parse(body)
            } catch (e) {
                callback('Cannot parse JSON respons')
            }
            if (json) callback(null, json)
        }
    })
}