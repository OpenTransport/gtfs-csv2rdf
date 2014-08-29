/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(AgenciesTransformer, Transform);

function AgenciesTransformer (feedname) {
  this._feedname = feedname;
  Transform.call(this, {objectMode : true});
}

AgenciesTransformer.prototype._flush = function () {
}

AgenciesTransformer.prototype._transform = function (data, encoding, done) {
  var subject = "http://gtfs.org/agencies/" + this._feedname + "/" + data["agency_id"];
  // dct:identifier triple
  var triple = {
    subject : subject,
    predicate : "http://purl.org/dc/terms/identifier",
    object : '"' + data["agency_id"] + '"'
  };
  this.push(triple);
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org#Agency"});

  // foaf:name triple
  if (data["agency_name"] ) {
    this.push({ subject: subject, predicate: "http://xmlns.com/foaf/0.1/name", object :'"' +  data["agency_name"]+'"' });
  }

  // foaf:homepage triple
  if (data["agency_url"] ) {
    this.push({ subject: subject, predicate: "http://xmlns.com/foaf/0.1/homepage", object :  data["agency_url"] });
  }

  // foaf:phone triple
  if (data["agency_phone"] ) {
    this.push({ subject: subject, predicate: "http://xmlns.com/foaf/0.1/phone", object :'"' +  data["agency_phone"]+'"' });
  }
  // gtfs:fareUrl triple
  if (data["agency_fare_url"] ) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org#fareUrl", object : data["agency_fare_url"] });
  }
  done();
};

module.exports = AgenciesTransformer;