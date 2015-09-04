/**
 * This helper class makes JSON-LD objects from a triples stream.
 * From the moment a subject is given which has got nothing to do with the current being composed object, the object is pushed to the client.
 * The script works in the philosophy that related triples are going to be streamed out next to each other.
 * 
 * @author Pieter Colpaert <pieter.colpaert@okfn.org>
 */
var TriplesToJSONLDStream = require('jsonld-stream').TriplesToJSONLDStream;

function TriplesToJSONLD () {
  return new TriplesToJSONLDStream({
    '@context' : {
      'gtfs' : 'http://vocab.gtfs.org/terms#',
      'geo' : 'http://www.w3.org/2003/01/geo/wgs84_pos#',
      'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      'time' : 'http://www.w3.org/2006/time#',
      'foaf' : 'http://xmlns.com/foaf/0.1/',
      'dct' : 'http://purl.org/dc/terms/',
      'rdfs' : 'http://www.w3.org/2000/01/rdf-schema#',
      'owl' : 'http://www.w3.org/2002/07/owl#',
      'xsd' : 'http://www.w3.org/2001/XMLSchema#',
      'skos' : 'http://www.w3.org/2004/02/skos/core#',
      'schema' : 'http://schema.org/',
      'dcat' : 'http://www.w3.org/ns/dcat#'
    }
  });
}

module.exports = TriplesToJSONLD;
