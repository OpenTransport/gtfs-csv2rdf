/**
 * NewTripleTransform checks whether the triple already exists and only returns the non existent
 *
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(StopsTransformer, Transform);

function StopsTransformer (feedname) {
  this._feedname = feedname;
  Transform.call(this, {objectMode : true});
}

StopsTransformer.prototype._flush = function () {
}

StopsTransformer.prototype._transform = function (data, encoding, done) {
  // This is where the mapping happens
  // data looks like this:
  /*
    { stop_id: '1483',
  stop_code: '',
  stop_name: 'WAASMONT Station',
  stop_lat: '50.727271',
  stop_lon: '5.073445',
  location_type: '0',
  parent_station: '',
  stop_timezone: '',
  wheelchair_boarding: '1',
  platform_code: '',
  zone_id: '' }
   */
  var subject = "http://gtfs.org/stops/" + this._feedname + "/" + data["stop_id"];
  // dct:identifier triple
  var triple = {
    subject : subject,
    predicate : "http://purl.org/dc/terms/identifier",
    object : '"' + data["stop_id"] + '"'
  };
  this.push(triple);
  // gtfs:code triple
  if (data["stop_code"] ) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org#code", object :'"' +  data["stop_code"]+'"' });
  }
  // foaf:name triple
  if (data["stop_name"] ) {
    this.push({ subject: subject, predicate: "http://xmlns.com/foaf/0.1/name", object :'"' +  data["stop_name"]+'"' });
  }
  // geo:lat triple
  if (data["stop_lat"] ) {
    this.push({ subject: subject, predicate: "http://www.w3.org/2003/01/geo/wgs84_pos#lat", object :'"' +  data["stop_lat"]+'"' });
  }
  // geo:long triple
  if (data["stop_lon"] ) {
    this.push({ subject: subject, predicate: "http://www.w3.org/2003/01/geo/wgs84_pos#long", object :'"' +  data["stop_lon"]+'"' });
  }
  done();
};

module.exports = StopsTransformer;