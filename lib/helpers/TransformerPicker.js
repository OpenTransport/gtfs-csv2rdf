/**
 * Returns a transformer for the specific filename
 * @param filename is the file name according to the GTFS spec (e.g., fare_attributes.txt)
 */
function pickTransformer (filename, options) {
  //first check whether options are okay
  if (!options) {
    throw 'Options not given. We want a feedname and a version.';
  }
  
  if (!options.baseuri) {
    throw 'Please set baseuri';
  }
  
  if (!options.feedname) {
    throw 'Please set feedname';
  }

  var gtfsFilenames = {
    'stops.txt' : require('../transformers/StopsTransformer.js'),
    'agency.txt' : require('../transformers/AgenciesTransformer.js'),
    'routes.txt' : require('../transformers/RoutesTransformer.js'),
    'trips.txt' : require('../transformers/TripsTransformer.js'),
    'stop_times.txt' : require('../transformers/StopTimesTransformer.js'),
    'calendar.txt' : require('../transformers/CalendarTransformer.js'),
    'calendar_dates.txt' : require('../transformers/CalendarDatesTransformer.js'),
    'feed_info.txt' : require('../transformers/FeedInfoTransformer.js'),
    'fare_attributes.txt' : require('../transformers/FareAttributesTransformer.js'),
    'fare_rules.txt' : require('../transformers/FareRulesTransformer.js'),
    'shapes.txt' : require('../transformers/ShapesTransformer.js'),
    'frequencies.txt' : require('../transformers/FrequenciesTransformer.js'),
    'transfers.txt' : require('../transformers/TransfersTransformer.js'),
  };
  
  if (gtfsFilenames[filename]) {
    return new gtfsFilenames[filename](options);
  } else {
    return null;
  }
};

module.exports = pickTransformer;
