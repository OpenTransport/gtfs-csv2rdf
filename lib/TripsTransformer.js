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
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org#Trip"});
  done();
};

module.exports = TripsTransformer;