/**
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var Transform = require('stream').Transform,
    util = require('util');

util.inherits(FeedInfoTransformer, Transform);

function FeedInfoTransformer (feedname) {
  this._feedname = feedname;
  Transform.call(this, {objectMode : true});
  this._feecount = 0;
}

FeedInfoTransformer.prototype._flush = function () {
}

FeedInfoTransformer.prototype._transform = function (data, encoding, done) {
  var subject = "http://gtfs.org/feeds/" + this._feedname + "#feed";
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
    this.push({ subject: subject, predicate: "http://purl.org/dc/terms/language", object: '"' + data["feed_lang"] + '"'});
  }
  if (data["feed_start_date"]){
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#startDate", object: '"' + data["feed_start_date"] + '"'});
  }
  if (data["feed_end_date"]){
    this.push({ subject: subject, predicate: "http://vocab.gtfs.org/terms#endDate", object: '"' + data["feed_end_date"] + '"'});
  }
  //has Distribution 1: the path towards the zip
  var zipsubject = "http://gtfs.org/feeds/" + this._feedname + "#zip";
  this.push({ subject: zipsubject , predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://www.w3.org/ns/dcat#Distribution" });
  this.push({ subject: zipsubject , predicate: "http://www.w3.org/ns/dcat#mediaType", object: '"'+ "application/zip"+'"' });
  //TODO ...
  //has Distribution 2: the path towards the Linked Data Fragments startfragment
  var ldfsubject = "http://data.gtfs.org/" + this._feedname + "#dataset";
  this.push({ subject: ldfsubject , predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://www.w3.org/ns/dcat#Distribution" });
  this.push({ subject: ldfsubject , predicate: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", object: "http://rdfs.org/ns/void#Dataset" });

  //Furthermore, the URIs will be dereferenced by redirecting towards the right triple fragments. Yet, this is implied by the Linked Data principles

  this._feedcount ++;
  done();
};

module.exports = FeedInfoTransformer;