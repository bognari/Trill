/**
 * Created by Dennis on 20/06/17.
 */

import ItemDbpedia from "./dbpedia"
import store from '../../stores/index';
/*
 * action types
 */

export const KNOWLEDGEBASE_REQUEST = 'KNOWLEDGEBASE_REQUEST'
export const KNOWLEDGEBASE_SUCCESSFULL = 'KNOWLEDGEBASE_SUCCESSFULL'
export const KNOWLEDGEBASE_ERROR = 'KNOWLEDGEBASE_ERROR'

/*
 * other constants
 */

/*
 * action creators
 */

export function info(index){
  return function (dispatch) {
    console.log(store.getState().knowledgebase);
    switch (store.getState().knowledgebase.knowledgebase) {
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
