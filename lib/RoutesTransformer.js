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
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org#Route"});
  done();
};

module.exports = RoutesTransformer;