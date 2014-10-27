var csv = require('csv');
var unzip = require('unzip');
var StopsTransformer = require('./StopsTransformer.js');
var AgenciesTransformer = require('./AgenciesTransformer.js');
var RoutesTransformer = require('./RoutesTransformer.js');
var TripsTransformer = require('./TripsTransformer.js');
var StopTimesTransformer = require('./StopTimesTransformer.js');
var CalendarTransformer = require('./CalendarTransformer.js');
var CalendarDatesTransformer = require('./CalendarDatesTransformer.js');
var FeedInfoTransformer = require('./FeedInfoTransformer.js');
var FareAttributesTransformer = require('./FareAttributesTransformer.js');
var FareRulesTransformer = require('./FareRulesTransformer.js');
var ShapesTransformer = require('./ShapesTransformer.js');
var FrequenciesTransformer = require('./FrequenciesTransformer.js');

/**
 * @param zipstream is an fstream configured with a to be read
 */
function Mapper(zipstream, outstream, options) {

  //first check whether options are okay
  if (!options) {
    throw "Options not given";
  }
  if (!options.feedname) {
    throw "Please set feedname";
  }
  if (!options.version) {
    throw "Please set version";
  }

  //Process the zipstream
  zipstream.pipe(unzip.Parse())
    .on('entry', function (entry) {
      var fileName = entry.path;
      var type = entry.type; // 'Directory' or 'File'
      var size = entry.size;

      if (fileName === "stops.txt") {
        console.error("Transforming Stops");
        var transform = new StopsTransformer(options);
        entry.pipe(csv.parse({'columns' : true }))
          .pipe(transform)
          .pipe(outstream);
      } else if (fileName === "agency.txt") {
        console.error("Transforming Agencies");
        var transform = new AgenciesTransformer(options);
        entry.pipe(csv.parse({'columns' : true }))
          .pipe(transform)
          .pipe(outstream);
      } else if (fileName === "routes.txt") {
        console.error("Transforming Routes");
        var transform = new RoutesTransformer(options);
        entry.pipe(csv.parse({'columns' : true }))
          .pipe(transform)
          .pipe(outstream);
      } else if (fileName === "trips.txt") {
        console.error("Transforming Trips");
        var transform = new TripsTransformer(options);
        entry.pipe(csv.parse({'columns' : true }))
          .pipe(transform)
          .pipe(outstream);
      } else if (fileName === "stop_times.txt") {
        console.error("Transforming Stop Times");
        var transform = new StopTimesTransformer(options);
        entry.pipe(csv.parse({'columns' : true }))
          .pipe(transform)
          .pipe(outstream);
      } else if (fileName === "calendar.txt") {
        console.error("Transforming Calendar");
        var transform = new CalendarTransformer(options);
        entry.pipe(csv.parse({'columns' : true }))
          .pipe(transform)
          .pipe(outstream);
      } else if (fileName === "calendar_dates.txt") {
        console.error("Transforming CalendarDates");
        var transform = new CalendarDatesTransformer(options);
        entry.pipe(csv.parse({'columns' : true }))
          .pipe(transform)
          .pipe(outstream);
       } else if (fileName === "fare_attributes.txt") {
         console.error("Transforming FareAttributes");
         var transform = new FareAttributesTransformer(options);
         entry.pipe(csv.parse({'columns' : true }))
          .pipe(transform)
          .pipe(outstream);
       } else if (fileName === "fare_rules.txt") {
         console.error("Transforming FareRules");
         var transform = new FareRulesTransformer(options);
         entry.pipe(csv.parse({'columns' : true }))
           .pipe(transform)
           .pipe(outstream);
       } else if (fileName === "shapes.txt") {
         console.error("Transforming Shapes and Shape Segments");
         var transform = new ShapesTransformer(options);
         entry.pipe(csv.parse({'columns' : true }))
           .pipe(transform)
           .pipe(outstream);
       } else if (fileName === "frequencies.txt") {
         console.error("Transforming Frequencies");
         var transform = new FrequenciesTransformer(options);
         entry.pipe(csv.parse({'columns' : true }))
           .pipe(transform)
           .pipe(outstream);
       }
       // else if (fileName === "transfers.txt") {
      //   console.error("Transforming Transfers");
      //   var transform = new TransfersTransformer(options);
      //   entry.pipe(csv.parse({'columns' : true }))
      //     .pipe(transform)
      //     .pipe(outstream);
      //}
      else if (fileName === "feed_info.txt") {
        console.error("Transforming Feed info");
         var transform = new FeedInfoTransformer(options);
         entry.pipe(csv.parse({'columns' : true }))
           .pipe(transform)
           .pipe(outstream);
      }
      else {
        console.error("draining " + fileName);
        entry.autodrain();
      }
    }).on("close", function () {
      outstream.end();
    });
};

module.exports = Mapper;
