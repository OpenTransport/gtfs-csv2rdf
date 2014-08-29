var csv = require('csv');
var unzip = require('unzip');
var StopsTransformer = require('./StopsTransformer.js');

function Mapper(zipstream, feedname, outstream) {
  if (!outstream) {
    outstream = process.stdout;
  }

  zipstream.pipe(unzip.Parse())
    .on('entry', function (entry) {
      var fileName = entry.path;
      var type = entry.type; // 'Directory' or 'File'
      var size = entry.size;

      if (fileName === "stops.txt") {
        console.error("Transforming Stops");
        var st = new StopsTransformer(feedname);
        entry.pipe(csv.parse({'columns' : true }))
          .pipe(st)
          .pipe(outstream);
      } else if (fileName === "") {
        //others...
      } else {
        console.error("draining " + fileName);
        entry.autodrain();
      }
    });
};

module.exports = Mapper;