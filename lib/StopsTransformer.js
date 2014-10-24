/**
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
  var subject = "http://data.gtfs.org/stops/" + this._feedname + "/" + data["stop_id"];
  // dct:identifier triple
  var triple = {
    subject : subject,
    predicate : "http://purl.org/dc/terms/identifier",
    object : '"' + data["stop_id"] + '"'
  };
  this.push(triple);
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#Stop"});
  // gtfs:code triple
  if (data["stop_code"] ) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#code", object :'"' +  data["stop_code"]+'"' });
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
  // gtfs:locationType triple
  if (data["location_type"] ) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#locationType", object :'"' +  data["location_type"]+'"' });
  }
  // gtfs:parentStation triple
  if (data["parent_station"] ) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#parentStation", object :'"' +  data["location_type"]+'"' });
  }
  done();
};

module.exports = StopsTransformer;
