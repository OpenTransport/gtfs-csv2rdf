/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(AgenciesTransformer, Transform);

function AgenciesTransformer (options) {
  this._feedbaseuri = options.baseuri + options.feedname + "/" + options.version ;
  this._options = options;
  Transform.call(this, {objectMode : true});
}

AgenciesTransformer.prototype._flush = function () {
}

AgenciesTransformer.prototype._transform = function (data, encoding, done) {
  var subject = this._feedbaseuri + "/agencies/" + data["agency_id"];
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#Agency"});

  // foaf:name triple
  if (data["agency_name"]) {
    this.push({ subject: subject, predicate: "http://xmlns.com/foaf/0.1/name", object : '"' + data["agency_name"] + '"^^http://www.w3.org/2001/XMLSchema#string' });
  }

  // foaf:page triple
  if (data["agency_url"]) {
    this.push({ subject: subject, predicate: "http://xmlns.com/foaf/0.1/page", object :  data["agency_url"] });
  }

  // foaf:phone triple
  if (data["agency_phone"]) {
    this.push({ subject: subject, predicate: "http://xmlns.com/foaf/0.1/phone", object :'"' +  data["agency_phone"]+'"' });
  }
  // gtfs:fareUrl triple
  if (data["agency_fare_url"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#fareUrl", object : data["agency_fare_url"] });
  }

  if (data["agency_timezone"]) {
    this.push({ subject: subject, predicate: "http://www.w3.org/2006/time#timeZone", object : '"' + data["agency_timezone"] + '"^^http://www.w3.org/2001/XMLSchema#string' });
  }

  done();
};

module.exports = AgenciesTransformer;
