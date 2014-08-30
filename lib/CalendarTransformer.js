/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(CalendarTransformer, Transform);

function CalendarTransformer (feedname) {
  this._feedname = feedname;
  Transform.call(this, {objectMode : true});
}

CalendarTransformer.prototype._flush = function () {
}

CalendarTransformer.prototype._transform = function (data, encoding, done) {
  var subject = "http://gtfs.org/services/" + this._feedname + "/" + data["service_id"];
  // dct:identifier triple
  var triple = {
    subject : subject,
    predicate : "http://purl.org/dc/terms/identifier",
    object : '"' + data["service_id"] + '"'
  };
  this.push(triple);
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#Service"});
  if (data["monday"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#monday", object: data["monday"]==="1"?"true":"false"});
  }
  if (data["tueday"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#tueday", object: data["tueday"]==="1"?"true":"false"});
  }
  if (data["wednesday"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#wednesday", object: data["wednesday"]==="1"?"true":"false"});
  }
  if (data["thursday"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#thursday", object: data["thursday"]==="1"?"true":"false"});
  }
  if (data["friday"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#friday", object: data["friday"]==="1"?"true":"false"});
  }
  if (data["saturday"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#saturday", object: data["saturday"]==="1"?"true":"false"});
  }
  if (data["sunday"]) {
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#sunday", object: data["sunday"]==="1"?"true":"false"});
  }
  if (data["start_date"]){
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#startDate", object: '"' + data["start_date"] + '"'});
  }
  if (data["end_date"]){
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#endDate", object: '"' + data["end_date"] + '"'});
  }
  
  done();
};

module.exports = CalendarTransformer;