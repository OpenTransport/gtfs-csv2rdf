# gtfs-csv2rdf

[![npm version](https://badge.fury.io/js/gtfs-csv2rdf.svg)](https://badge.fury.io/js/gtfs-csv2rdf)

Mapping library which transforms GTFS CSV files into GTFS triples using the [Linked GTFS vocabulary](http://vocab.gtfs.org).

If you need route planning over Linked Data, then please check out the [Linked Connections framework](https://linkedconnections.org) instead. Transforming GTFS to Linked Data will _not_ return you the data in a format that is useful for route planning.

## Use

Requirements:
 * node js

Install using `npm install gtfs-csv2rdf --save`

### Command Line

In this case, you can install it globally using `npm install -g gtfs-csv2rdf`

```bash
# First argument: path to gtfs
# Second argument: the base URI
# Third argument (optional): the requested format (turtle (default), ntriples or jsonld)
gtfs-csv2rdf path-to-gtfs.zip http://data.gtfs.org/sample-feed/0.1/ turtle > gtfsintriples.ttl
```
### As a nodejs library

By example:

```javascript
var fs = require('fs');
var N3 = require('n3');
var gtfs-csv2rdf = require('gtfs-csv2rdf').zipToTriples;
var path = "/path/to/gtfs.zip";
if (/(.*\/)?(.*?)\.zip/.exec(path)) {
  var feedname = /(.*\/)?(.*?)\.zip/.exec(path)[2];
} else {
  throw "Not a zip file: " + path;
}
//create the writer of turtle file towards stdout
var streamWriter = new N3.StreamWriter({ 'gtfs': 'http://vocab.gtfs.org/terms#',
                                         'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                                         'foaf' : 'http://xmlns.com/foaf/0.1/',
                                         'dct' : 'http://purl.org/dc/terms/',
                                         'rdfs' : 'http://www.w3.org/2000/01/rdf-schema#',
                                         'owl' : 'http://www.w3.org/2002/07/owl#',
                                         'xsd' : 'http://www.w3.org/2001/XMLSchema#',
                                         'vann' : 'http://purl.org/vocab/vann/',
                                         'skos' : 'http://www.w3.org/2004/02/skos/core#',
                                         'dcat' : 'http://www.w3.org/ns/dcat#'});
streamWriter.pipe(process.stdout);
var options = {
  feedname : feedname,
  baseuri : "http://data.example.org/sample-feed/0.1/"
};
gtfscsv2rdf(fs.createReadStream(path), streamWriter, options);
```

For other functions, check out the [main file of the library](https://github.com/OpenTransport/gtfs-csv2rdf/blob/master/lib/gtfs-csv2rdf.js)
