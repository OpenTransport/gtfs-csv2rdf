/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(RoutesTransformer, Transform);

function RoutesTransformer (feedname) {
  this._feedname = feedname;
  Transform.call(this, {objectMode : true});
}

RoutesTransformer.prototype._flush = function () {
}

RoutesTransformer.prototype._transform = function (data, encoding, done) {
  var subject = "http://gtfs.org/routes/" + this._feedname + "/" + data["route_id"];
  // dct:identifier triple
  var triple = {
    subject : subject,
    predicate : "http://purl.org/dc/terms/identifier",
    object : '"' + data["route_id"] + '"'
  };
  this.push(triple);
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#Route"});
  if (data["agency_id"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#agency", object: "http://gtfs.org/agencies/" + this._feedname + "/" + data["agency_id"]});
  }
  if (data["route_short_name"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#shortName", object: '"' + data["route_short_name"] + '"'});
  }
  if (data["route_long_name"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#longName", object: '"' + data["route_long_name"] + '"'});
  }
  if (data["route_desc"]) {
    this.push({ subject: subject, predicate: "http://purl.org/dc/terms/description", object: '"' + data["route_desc"] + '"'});
  }
  if (data["route_type"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#routeType", object: '"' + data["route_type"] + '"'});
  }
  if (data["route_url"] ) {
    this.push({ subject: subject, predicate: "http://xmlns.com/foaf/0.1/page", object :  data["route_url"] });
  }
  if (data["route_color"] ) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#color", object :  '"' + data["route_color"]+'"' });
  }
  if (data["route_textColor"] ) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#textColor", object: '"' + data["route_textColor"] + '"' });
  }
  
  done();
};

module.exports = RoutesTransformer;