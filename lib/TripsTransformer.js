/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(TripsTransformer, Transform);

function TripsTransformer (options) {
  this._feedbaseuri = options.baseuri + options.feedname + "/" + options.version ;
  this._options = options;
  Transform.call(this, {objectMode : true});
}

TripsTransformer.prototype._flush = function () {
}

TripsTransformer.prototype._transform = function (data, encoding, done) {
  var subject = this._feedbaseuri + "/trips/" + data["trip_id"];
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#Trip"});

  //todo: add support for expanding route IDs in future GTFS specification
  if (data["route_id"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#route", object: this._feedbaseuri + "/routes/" + data["route_id"]});
  }
  if (data["service_id"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#service", object: this._feedbaseuri + "/services/" + data["service_id"]});
  }
  if (data["trip_headsign"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#headsign", object: '"' + data["trip_headsign"] + '"^^http://www.w3.org/2001/XMLSchema#string'});
  }
  if (data["trip_short_name"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#shortName", object: '"' + data["trip_short_name"] + '"^^http://www.w3.org/2001/XMLSchema#string'});
  }
  if (data["direction_id"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#direction", object: (data["direction_id"] === "1"?"\"true\"":"\"false\"") + '^^http://www.w3.org/2001/XMLSchema#boolean'});
  }
  if (data["block_id"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#block", object: '"' + data["block_id"] + '"'});
  }
  if (data["shape_id"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#shape", object: this._feedbaseuri + "/shapes/" + data["shape_id"]});
  }
  if (data["wheelchair_accessible"]) {
    if (data["wheelchair_accessible"] === "0") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#wheelchairAccessible", object: "<http://vocab.gtfs.org/terms#CheckParentStation>"});
    } else if (data["wheelchair_accessible"] === "1") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#wheelchairAccessible", object: "<http://vocab.gtfs.org/terms#WheelchairAccessible>"});
    } else if (data["wheelchair_accessible"] === "2") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#wheelchairAccessible", object: "<http://vocab.gtfs.org/terms#NotWheelchairAccessible>"});
    }
  }
  if (data["bikes_allowed"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#bikesAllowed", object: (data["bikes_allowed"] == 1 ? "\"true\"": "\"false\"") + '^^http://www.w3.org/2001/XMLSchema#boolean' });
  }
  done();
};

module.exports = TripsTransformer;
