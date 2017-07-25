/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// General configuration file
export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
//The url where qanary is running
export const qanary_services =  "https://wdaqua-qanary.univ-st-etienne.fr";
//The url where qanary is pushing the information
export const qanary_endpoint =  "https://wdaqua-endpoint.univ-st-etienne.fr/qanary/query";
//The url of the dbpedia and wikidata endpoints to use
export const dbpedia_endpoint = "https://dbpedia.org/sparql";
export const wikidata_endpoint = "https://query.wikidata.org/sparql";
export const musicbrainz_endpoint = "http://wdaqua.univ-st-etienne.fr/hdt-endpoint/musicbrainz/sparql";
export const dblp_endpoint = "http://wdaqua.univ-st-etienne.fr/hdt-endpoint/dblp/sparql";
//export const sparqlToUserEndpoint =  "http://localhost:1920/sparqltouser";
export const sparqlToUserEndpoint =  "https://wdaqua-sparqltouser.univ-st-etienne.fr/sparqltouser";
export const audio_pipeline = "SpeechRecognitionKaldi";
export const text_pipeline = "wdaqua-core0, QueryExecuter";
//export const databaseUrl = process.env.DATABASE_URL || 'postgresql://demo:Lqk62xg6TBm5UhfR@demo.ctbl5itzitm4.us-east-1.rds.amazonaws.com:5432/membership01';

export const analytics = {

  // https://analytics.google.com/
  google: { trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-XXXXX-X' },

};



export const auth = {

  jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },

  // https://developers.facebook.com/
  facebook: {
    id: process.env.FACEBOOK_APP_ID || '186244551745631',
    secret: process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc',
  },

  // https://cloud.google.com/console/project
  google: {
    id: process.env.GOOGLE_CLIENT_ID || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
    secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
  },

  // https://apps.twitter.com/
  twitter: {
    key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
    secret: process.env.TWITTER_CONSUMER_SECRET || 'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
  },

};
