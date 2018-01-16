/**
 * Created by Dennis on 20/06/17.
 */

import store from '../../stores/index';
import ResultSetMusicbrainz from "./implemented/musicbrainz2";
import ResultSetFreebase from "./implemented/freebase2";
import ResultSetOpenStreetMap from "./implemented/openstreetmap2";
import ResultSetWikidata from "./implemented/wikidata2";
import ResultSetDbpedia from "./implemented/dbpedia2";
import ResultSetDblp from "./implemented/dblp2";
import ResultSetScigraph from "./implemented/scigraph2";

export function info2(kb,jresult,query){
  return function (dispatch) {
    var resultSet = null;
    switch (kb) {
      case "wikidata": {
        resultSet = new ResultSetWikidata(jresult, query);
        dispatch(resultSet.startRequest());
        break;
      }
      case "dbpedia": {
        resultSet = new ResultSetDbpedia(jresult, query);
        dispatch(resultSet.startRequest());
        break;
      }
      case "musicbrainz": {
        resultSet = new ResultSetMusicbrainz(jresult, query);
        dispatch(resultSet.startRequest());
        break;
      }
      case "dblp": {
        resultSet = new ResultSetDblp(jresult, query);
        dispatch(resultSet.startRequest());
        break;
      }
      case "biennale": {
        //resultSet = new ResultSetWikidata(jresult, data.sparql[0].query);
      }
      case "freebase": {
        resultSet = new ResultSetFreebase(jresult, query);
        dispatch(resultSet.startRequest());
        break;
      }
      case "scigraph": {
        resultSet = new ResultSetScigraph(jresult, query);
        dispatch(resultSet.startRequest());
        break;
      }
      case "openstreetmap": {
        resultSet = new ResultSetOpenStreetMap(jresult, query);
        dispatch(resultSet.startRequest());
        break;
      }
      console.log("ERROR The following knowledgebase is not supported:", kb);
    }
  }
}
