# gtfs-csv2rdf


Mapping script which transforms GTFS CSV into GTFS RDF

## Use

Requirements:
 * node js

Install using `npm install`

### Command Line

```bash
# First argument: path to gtfs
# Second argument: the version of the feed
# Third argument: the base URI
./gtfs-csv2rdf path-to-gtfs.zip 0.1 http://data.gtfs.org/  > gtfsintriples.ttl
```

### As a nodejs library

By example:

```javascript
var fs = require('fs');
var N3 = require('n3');
var gtfscsv2rdf = require('./lib/gtfs-csv2rdf.js');
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
  version : "0.1",
  baseuri : "http://data.gtfs.org/"
};
gtfscsv2rdf(fs.createReadStream(path), streamWriter, options);
```
