/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(FrequenciesTransformer, Transform);

function FrequenciesTransformer (options) {
  this._feedbaseuri = options.baseuri + options.feedname + "/" + options.version ;
  this._options = options;
  Transform.call(this, {objectMode : true});
}

FrequenciesTransformer.prototype._flush = function () {
}

FrequenciesTransformer.prototype._transform = function (data, encoding, done) {
  if (data["trip_id"] && data["start_time"] && data["end_time"] && data["headway_secs"]) {
    var subject = this._feedbaseuri + "/trips/" + data["trip_id"] + "/frequencies/" + data["start_time"] + data["end_time"];
    this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#Frequency"});
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#startTime", object: '"' + data["start_time"] + '"'});
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#endTime", object: '"' + data["end_time"] + '"'});
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#headwaySeconds", object: '"' + data["headway_secs"] + '"^^http://www.w3.org/2001/XMLSchema#string'});
    if (data["exact_times"]) {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#headwaySeconds", object: '"' + (data["exact_times"] === "1"?"true":"false") + '"^^http://www.w3.org/2001/XMLSchema#boolean'});
    } else {
      this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#headwaySeconds", object: '"false"^^http://www.w3.org/2001/XMLSchema#boolean'});
    }
  } else {
    console.error("Frequency doesn't contain all required fields");
  }
  done();
};

module.exports = FrequenciesTransformer;
