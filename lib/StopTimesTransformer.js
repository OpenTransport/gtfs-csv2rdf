/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(StopTimesTransformer, Transform);

function StopTimesTransformer (feedname) {
  this._feedname = feedname;
  Transform.call(this, {objectMode : true});
}

StopTimesTransformer.prototype._flush = function () {
}

StopTimesTransformer.prototype._transform = function (data, encoding, done) {
  //Todo: this is not the way to go: is not unique over time
  var subject = "http://gtfs.org/stops/" + this._feedname + "/" + data["stop_id"] + "/stoptimes/" + data["trip_id"];
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org#StopTime"});
  done();
};

module.exports = StopTimesTransformer;