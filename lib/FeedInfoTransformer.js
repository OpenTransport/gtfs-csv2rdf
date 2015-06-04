/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util'),
    moment = require('moment');

util.inherits(FeedInfoTransformer, Transform);

function FeedInfoTransformer (options) {
  this._feedbaseuri = options.baseuri + options.feedname + "/" + options.version ;
  this._options = options;
  Transform.call(this, {objectMode : true});
  this._feedcount = 0;
}

FeedInfoTransformer.prototype._flush = function () {
}

FeedInfoTransformer.prototype._transform = function (data, encoding, done) {
  var subject = this._feedbaseuri + "#feed";
  // dct:identifier triple
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://vocab.gtfs.org/terms#Feed"});
  this.push({ subject: subject, predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://www.w3.org/ns/dcat#Dataset"});
  this.push({ subject: subject, predicate: "http://purl.org/dc/terms/publisher", object: "_:b" + this._feedcount}); //this is a blank node: we're not sure what URI the publisher has, but we know this URI has a foaf:page and a foaf:name
  if (data["feed_publisher_name"]) {
    this.push({subject: "_:b" + this._feedcount,predicate: "http://xmlns.com/foaf/0.1/name" , object: '"' + data["feed_publisher_name"] + '"'});
  }
  if (data["feed_publisher_url"]) {
    this.push({subject: "_:b" + this._feedcount,predicate: "http://xmlns.com/foaf/0.1/page" , object: data["feed_publisher_url"]});
  }
  if (data["feed_lang"]) {
    //todo: change this into a URI
    this.push({ subject: subject, predicate: "http://purl.org/dc/terms/language", object: '"' + data["feed_lang"] + '"'});
  }
  if (data["feed_start_date"] && data["feed_end_date"]) {
    var temporal = this._feedbaseuri + "/timespan";
    this.push({ subject: subject, predicate: "http://purl.org/dc/terms/temporal", object: temporal});
    this.push({ subject: temporal, predicate: "http://schema.org/startDate", object: '"' + moment(data["feed_start_date"], "YYYYMMDD").format("YYYY-MM-DD") + '"^^http://www.w3.org/2001/XMLSchema#date'});
    this.push({ subject: temporal, predicate: "http://schema.org/endDate", object: '"' + moment(data["feed_end_date"], "YYYYMMDD").format("YYYY-MM-DD") + '"^^http://www.w3.org/2001/XMLSchema#date'});
  }
  if (data["feed_version"]) {
    this.push({ subject: subject, predicate: "http://schema.org/version", object: '"' + data["feed_version"] + '"'});
  } else {
    this.push({ subject: subject, predicate: "http://schema.org/version", object: '"' + this._options.version +'"'});
  }
  //has Distribution 1: the path towards the zip

  //TODO: use the URI of the download location, and not a hash
  var zipsubject = this._feedbaseuri + "#zip";
  this.push({ subject: zipsubject , predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://www.w3.org/ns/dcat#Distribution" });
  this.push({ subject: zipsubject , predicate: "http://www.w3.org/ns/dcat#mediaType", object: '"'+ "application/zip"+'"' });
  //TODO ...
  //has Distribution 2: the path towards the Linked Data Fragments startfragment
  var ldfsubject = "http://data.gtfs.org/triples/all";
  this.push({ subject: ldfsubject , predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://www.w3.org/ns/dcat#Distribution" });
  this.push({ subject: ldfsubject , predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://rdfs.org/ns/void#Dataset" });

  this._feedcount ++;
  done();
};

module.exports = FeedInfoTransformer;
