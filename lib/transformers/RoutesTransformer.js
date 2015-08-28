/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(RoutesTransformer, Transform);

function RoutesTransformer (options) {
  this._feedbaseuri = options.baseuri + options.feedname + "/" + options.version ;
  this._options = options;
  Transform.call(this, {objectMode : true});
}

RoutesTransformer.prototype._transform = function (data, encoding, done) {
  var subject = this._feedbaseuri + "/routes/" + data["route_id"];
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#Route"});
  if (data["agency_id"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#agency", object: this._feedbaseuri + "/agencies/" + data["agency_id"]});
  }
  if (data["route_short_name"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#shortName", object: '"' + data["route_short_name"] + '"^^http://www.w3.org/2001/XMLSchema#string'});
  }
  if (data["route_long_name"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#longName", object: '"' + data["route_long_name"] + '"^^http://www.w3.org/2001/XMLSchema#string'});
  }
  if (data["route_desc"]) {
    this.push({ subject: subject, predicate: "http://purl.org/dc/terms/description", object: '"' + data["route_desc"] + '"^^http://www.w3.org/2001/XMLSchema#string'});
  }
  if (data["route_type"]) {
    if (data["route_type"] === "0") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#routeType", object: "http://vocab.gtfs.org/terms#LightRail"});
    } else if (data["route_type"] === "1") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#routeType", object: "http://vocab.gtfs.org/terms#SubWay"});
    } else if (data["route_type"] === "2") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#routeType", object: "http://vocab.gtfs.org/terms#Rail"});
    } else if (data["route_type"] === "3") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#routeType", object: "http://vocab.gtfs.org/terms#Bus"});
    } else if (data["route_type"] === "4") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#routeType", object: "http://vocab.gtfs.org/terms#Ferry"});
    } else if (data["route_type"] === "5") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#routeType", object: "http://vocab.gtfs.org/terms#CableCar"});
    } else if (data["route_type"] === "6") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#routeType", object: "http://vocab.gtfs.org/terms#Gondola"});
    } else if (data["route_type"] === "7") {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#routeType", object: "http://vocab.gtfs.org/terms#Funicular"});
    }
  }
  if (data["route_url"] ) {
    this.push({ subject: subject, predicate: "http://xmlns.com/foaf/0.1/page", object :  data["route_url"] });
  }
  if (data["route_color"] ) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#color", object :  '"' + data["route_color"]+'"^^http://www.w3.org/2001/XMLSchema#string' });
  }
  if (data["route_textColor"] ) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#textColor", object: '"' + data["route_textColor"] + '"^^http://www.w3.org/2001/XMLSchema#string' });
  }

  done();
};

module.exports = RoutesTransformer;
