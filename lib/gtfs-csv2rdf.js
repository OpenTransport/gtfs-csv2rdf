module.exports = {
  StopsTransformer : require('./transformers/StopsTransformer.js'),
  AgenciesTransformer : require('./transformers/AgenciesTransformer.js'),
  RoutesTransformer : require('./transformers/RoutesTransformer.js'),
  TripsTransformer : require('./transformers/TripsTransformer.js'),
  StopTimesTransformer : require('./transformers/StopTimesTransformer.js'),
  CalendarTransformer : require('./transformers/CalendarTransformer.js'),
  CalendarDatesTransformer : require('./transformers/CalendarDatesTransformer.js'),
  FeedInfoTransformer : require('./transformers/FeedInfoTransformer.js'),
  FareAttributesTransformer : require('./transformers/FareAttributesTransformer.js'),
  FareRulesTransformer : require('./transformers/FareRulesTransformer.js'),
  ShapesTransformer : require('./transformers/ShapesTransformer.js'),
  FrequenciesTransformer : require('./transformers/FrequenciesTransformer.js'),
  TransfersTransformer : require('./transformers/TransfersTransformer.js'),
  //a helper function from zip to triples
  zipToTriples : require('./helpers/ZipToTriples.js'),
  //a helper function to pick a transformer based on a filename
  pickTransformer : require('./helpers/TransformerPicker.js'),
  //a helper transformer: from triples stream to json-ld
  toJsonLD : require('./helpers/TriplesToJSONLD.js')
};
