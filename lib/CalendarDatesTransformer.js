/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(CalendarDatesTransformer, Transform);

function CalendarDatesTransformer (feedname) {
  this._feedname = feedname;
  Transform.call(this, {objectMode : true});
}

CalendarDatesTransformer.prototype._flush = function () {
}

CalendarDatesTransformer.prototype._transform = function (data, encoding, done) {
  var subject = "http://data.gtfs.org/" + this._feedname + "/services/" + data["service_id"];
  // dct:identifier triple
  var triple = {
    subject : subject,
    predicate : "http://purl.org/dc/terms/identifier",
    object : '"' + data["service_id"] + '"'
  };
  this.push(triple);
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#Service"});
  if (data["exception_type"]) {
    //1 is added for the certain date
    //2 is removed for the certain date
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#exceptionType", object: '"'+data["exception_type"]+'"'});
  }
  if (data["date"]){
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#date", object: '"' + data["date"] + '"'});
  }

  done();
};

module.exports = CalendarDatesTransformer;
