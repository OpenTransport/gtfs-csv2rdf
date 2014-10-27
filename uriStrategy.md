# URI strategy for gtfs.org

## Ontology

Hosted at http://vocab.gtfs.org/terms

All terms are added directly behind this namespace URI with a # in between.

## Data

### Feeds

The feed gets created with a version number attached: `http://data.gtfs.org/{feed_name}/{feed_version}`. This version is needed as local identifiers are not persistent when version numbers change.

### Stops, Trips, Routes, Zones...

Everything with a single id in the original GTFS spec is mapped like this (example for stops): `http://data.gtfs.org/{feed_name}/{feed_version}/stops/{local_id}`

### Stop Times

Stop Times don't have a single URI. It is referred to as the vehicle stopping at a certain gtfs:Stop when on a certain gtfs:Trip. Therefore, we have this template for Stop Times:

`http://data.gtfs.org/{feed_name}/{feed_version}/stops/{local_id}`

The URIs, when being dereferenced will get a HTTP 303 towards the triple pattern fragment at our server with server filled out.
