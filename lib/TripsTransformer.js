/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(TripsTransformer, Transform);

function TripsTransformer (feedname) {
  this._feedname = feedname;
  Transform.call(this, {objectMode : true});
}

TripsTransformer.prototype._flush = function () {
}

TripsTransformer.prototype._transform = function (data, encoding, done) {
  var subject = "http://gtfs.org/trips/" + this._feedname + "/" + data["trip_id"];
  // dct:identifier triple
  var triple = {
    subject : subject,
    predicate : "http://purl.org/dc/terms/identifier",
    object : '"' + data["trip_id"] + '"'
  };
  this.push(triple);
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#Trip"});

  //todo: add support for expanding route IDs in future GTFS specification
  if (data["route_id"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#route", object: "http://gtfs.org/routes/" + this._feedname + "/" + data["route_id"]});
  }
  if (data["service_id"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#service", object: "http://gtfs.org/services/" + this._feedname + "/" + data["service_id"]});
  }
  if (data["trip_headsign"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#headsign", object: '"' + data["trip_headsign"] + '"'});
  }
  if (data["trip_short_name"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#shortName", object: '"' + data["trip_short_name"] + '"'});
  }
  if (data["direction_id"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#direction", object: '"' + data["direction_id"] + '"'});
  }
  if (data["block_id"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#block", object: '"' + data["block_id"] + '"'});
  }
  if (data["shape_id"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#shape", object: '"' + data["shape_id"] + '"'});
  }
  if (data["wheelchair_accessible"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#wheelchairAccessible", object: '"' + data["wheelchair_accessible"] + '"'});
  }
  if (data["bikes_allowed"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#bikesAllowed", object: '"' + data["bikes_allowed"] + '"'});
  }
  done();
};

module.exports = TripsTransformer;