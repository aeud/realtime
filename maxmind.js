var mmdbreader = require('maxmind-db-reader')
var countries = mmdbreader.openSync(__dirname + '/countries.mmdb')
var geodata = countries.getGeoDataSync('128.101.101.101');
console.log(countries.getDatabaseMetadata())