/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util'),
    moment = require('moment');

util.inherits(CalendarDatesTransformer, Transform);

function CalendarDatesTransformer (options) {
  this._feedbaseuri = options.baseuri + options.feedname + "/" + options.version ;
  this._options = options;
  Transform.call(this, {objectMode : true});
}

CalendarDatesTransformer.prototype._flush = function () {
}

CalendarDatesTransformer.prototype._transform = function (data, encoding, done) {
  var subject = this._feedbaseuri + "/services/" + data["service_id"];
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#Service"});
  var servicerule = subject + "/servicerules/" + data["date"];
  this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#serviceRule", object: servicerule});
  this.push({ subject: servicerule, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#ServiceRule"});
  this.push({ subject: servicerule, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#CalendarDateRule"});

  if (data["exception_type"]) {
    //1 is added for the certain date
    //2 is removed for the certain date
    this.push({ subject: servicerule, predicate: "http://vocab.gtfs.org/terms#dateAddition", object: '"' + (data["exception_type"] === "1"?"true":"false") + '"^^http://www.w3.org/2001/XMLSchema#boolean'});
  }

  if (data["date"]){
    this.push({ subject: servicerule, predicate: "http://purl.org/dc/terms/date", object: '"' + moment(data["date"], "YYYYMMDD").format("YYYY-MM-DD") + '"^^http://www.w3.org/2001/XMLSchema#date'});
  }

  done();
};

module.exports = CalendarDatesTransformer;
