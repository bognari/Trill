/**
 * Created by Dennis on 20/06/17.
 */

import store from '../../stores/index';
import ItemDbpedia from "./implemented/dbpedia"
import ItemWikidata from "./implemented/wikidata"


export function info(index){
  return function (dispatch) {
    console.log(store.getState().knowledgebase);
    switch (store.getState().knowledgebase.knowledgebase) {
      case "wikidata": {
        console.log("Here");
        var itemWikidata = new ItemWikidata(index);
        dispatch(itemWikidata.startRequest());
        break;
      }
      case "dbpedia": {
        console.log("Here");
        var itemDbpedia = new ItemDbpedia(index);
        dispatch(itemDbpedia.startRequest());
        break;
      }

      console.log("ERROR The following knowledgebase is not supported:",store.getState().knowledgebase.knowledgebase);

    }
  }
}
