var unzip = require('unzip');
var csv = require('csv');
var pickTransformer = require('./TransformerPicker.js');

/**
 * This function pipes an fstream of a gtfs zip file to a set of outstreams, depending on what is requested. Extracting the zip-file itself happens in here.
 * @param zipstream is an fstream configured with a to be read zip file
 * @param outstream is an output stream
 */
function zipStreamToTriples (zipstream, outstream, options) {
  //first check whether options are okay
  if (!options) {
    throw "Options not given. We want a feedname and a version.";
  }
  if (!options.feedname) {
    throw "Please set feedname";
  }
  if (!options.baseuri) {
    throw "Please set baseuri";
  }

  var lastTransformer = null;
  //Process the zipstream
  var stream = zipstream.pipe(unzip.Parse());
  stream.on('entry', function (entry) {
      var fileName = entry.path;
      var type = entry.type; // 'Directory' or 'File'
      var size = entry.size;
      var transformer = pickTransformer(fileName, options);
      lastTransformer = transformer;
      if (transformer) {
        entry.pipe(csv.parse({'columns' : true, 'relax': true }))
          .pipe(transformer)
          .pipe(outstream, {'end' : false});
        transformer.on('finish', function () {
          //small zip-stream hack: if after 2 seconds, there's no other transformer, it means our zipstream ended.
          setTimeout(function () {
            if (lastTransformer === transformer) {
              stream.end();
              outstream.end();
            }
          },200);
        });
        lastTransformer = transformer;
      } else {
        console.error('draining ' + fileName);
        entry.autodrain();
      }
    });
    
  outstream.on('finish', function () {
    console.error('done!');
  });
};

module.exports = zipStreamToTriples;
