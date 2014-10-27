/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(StopTimesTransformer, Transform);

function StopTimesTransformer (options) {
  this._feedbaseuri = options.baseuri + options.feedname + "/" + options.version ;
  this._options = options;
  Transform.call(this, {objectMode : true});
}

StopTimesTransformer.prototype._flush = function () {
}

StopTimesTransformer.prototype._transform = function (data, encoding, done) {
  var subject = this._feedbaseuri + "/trip/" + data["trip_id"] + "/stop/" + data["stop_id"];
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#StopTime"});
  this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#stop", object: this._feedbaseuri + "/stops/"  + data["stop_id"]});
  this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#trip", object: this._feedbaseuri + "/trips/" + data["trip_id"]});
  if (data["arrival_time"]){
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#arrivalTime", object: '"' + data["arrival_time"] + '"'});
  }
  if (data["departure_time"]){
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#departureTime", object: '"' + data["departure_time"] + '"'});
  }
  if (data["stop_sequence"]){
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#stopSequence", object: '"' + data["stop_sequence"] + '"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger'});
  }
  if (data["stop_headsign"]){
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#headsign", object: '"' + data["stop_headsign"] + '"^^http://www.w3.org/2001/XMLSchema#string'});
  }
  if (data["pickup_type"]){
    if (data["pickup_type"] === "0") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#pickupType", object: "http://vocab.gtfs.org/terms#Regular"});
    } else if (data["pickup_type"] === "1") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#pickupType", object: "http://vocab.gtfs.org/terms#NotAvailable"});
    } else if (data["pickup_type"] === "2") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#pickupType", object: "http://vocab.gtfs.org/terms#MustPhone"});
    } else if (data["pickup_type"] === "3") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#pickupType", object: "http://vocab.gtfs.org/terms#MustCoordinateWithDriver"});
    }
  }
  if (data["drop_off_type"]){
    if (data["drop_off_type"] === "0") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#dropOffType", object: "http://vocab.gtfs.org/terms#Regular"});
    } else if (data["drop_off_type"] === "1") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#dropOffType", object: "http://vocab.gtfs.org/terms#NotAvailable"});
    } else if (data["drop_off_type"] === "2") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#dropOffType", object: "http://vocab.gtfs.org/terms#MustPhone"});
    } else if (data["drop_off_type"] === "3") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#dropOffType", object: "http://vocab.gtfs.org/terms#MustCoordinateWithDriver"});
    }
  }
  if (data["shape_dist_traveled"]){
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#shapeDistTraveled", object: '"' + data["shape_dist_traveled"] + '"^^http://www.w3.org/2001/XMLSchema#nonNegativeInteger'});
  }
  done();
};

module.exports = StopTimesTransformer;
