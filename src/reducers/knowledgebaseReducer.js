/**
 * Created by Dennis on 30/06/17.
 */

import { KNOWLEDGEBASE_CHANGE} from '../actions/knowledgebase'

const initialStateKnowledgebase = {
  knowledgebase: "wikidata", //initial language of the website set to english
}

export default function knowledgebaseReducer (state = initialStateKnowledgebase, action){
  switch (action.type) {
    case KNOWLEDGEBASE_CHANGE: {
      return {
        ...state,
        knowledgebase: action.knowledgebase,
      }
      break;
    }
  }
  return state;
}
