/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(CalendarTransformer, Transform);

function CalendarTransformer (options) {
  this._feedbaseuri = options.baseuri + options.feedname + "/" + options.version ;
  this._options = options;
  Transform.call(this, {objectMode : true});
}

CalendarTransformer.prototype._flush = function () {
}

CalendarTransformer.prototype._transform = function (data, encoding, done) {
  var subject = this._feedbaseuri + "/services/" + data["service_id"];
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#Service"});
  var servicerule = subject + "/servicesrules/calendarrule";
  this.push({ subject: servicerule, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#ServiceRule"});
  this.push({ subject: servicerule, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#CalendarRule"});
  this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#serviceRule", object: servicerule});

  if (data["monday"]) {
    this.push({ subject: servicerule, predicate: "http://vocab.gtfs.org/terms#monday", object: ( data["monday"] === "1"?"\"true\"":"\"false\"" ) + "^^http://www.w3.org/2001/XMLSchema#boolean"});
  }
  if (data["tuesday"]) {
    this.push({ subject: servicerule, predicate: "http://vocab.gtfs.org/terms#tuesday", object: ( data["tueday"] === "1"?"\"true\"":"\"false\"" ) + "^^http://www.w3.org/2001/XMLSchema#boolean"});
  }
  if (data["wednesday"]) {
    this.push({ subject: servicerule, predicate: "http://vocab.gtfs.org/terms#wednesday", object: ( data["wednesday"] === "1"?"\"true\"":"\"false\"" ) + "^^http://www.w3.org/2001/XMLSchema#boolean"});
  }
  if (data["thursday"]) {
    this.push({ subject: servicerule, predicate: "http://vocab.gtfs.org/terms#thursday", object: ( data["thursday"] === "1"?"\"true\"":"\"false\"" ) + "^^http://www.w3.org/2001/XMLSchema#boolean"});
  }
  if (data["friday"]) {
    this.push({ subject: servicerule, predicate: "http://vocab.gtfs.org/terms#friday", object: ( data["friday"] === "1"?"\"true\"":"\"false\"" ) + "^^http://www.w3.org/2001/XMLSchema#boolean"});
  }
  if (data["saturday"]) {
    this.push({ subject: servicerule, predicate: "http://vocab.gtfs.org/terms#saturday", object: ( data["saturday"] === "1"?"\"true\"":"\"false\"" ) + "^^http://www.w3.org/2001/XMLSchema#boolean"});
  }
  if (data["sunday"]) {
    this.push({ subject: servicerule, predicate: "http://vocab.gtfs.org/terms#sunday", object: ( data["sunday"] === "1"?"\"true\"":"\"false\"" ) + "^^http://www.w3.org/2001/XMLSchema#boolean"});
  }
  if (data["start_date"] && data["end_date"]){
    var temporal = servicerule + "/temporal";
    this.push({ subject: servicerule, predicate: "http://purl.org/dc/terms/temporal", object: temporal});
    this.push({ subject: temporal, predicate: "http://schema.org/startDate", object: '"' + data["start_date"] + '"^^http://www.w3.org/2001/XMLSchema#date'});
    this.push({ subject: temporal, predicate: "http://schema.org/endDate", object: '"' + data["end_date"] + '"^^http://www.w3.org/2001/XMLSchema#date'});
  }
  done();
};

module.exports = CalendarTransformer;
