/**
 * Created by Dennis on 30/06/17.
 */

import { QANARY_REQUEST, QANARY_SUCCESS, QANARY_FAILURE, } from '../actions/qanary'
import {ITEM_KNOWLEDGEBASE_REQUEST, ITEM_KNOWLEDGEBASE_SUCCESS, ITEM_KNOWLEDGEBASE_FAILURE} from '../actions/knowledge_base/knowledgeBase'

export const SET_QUESTION = 'SET_QUESTION';

const initialState = {
  uriInput: true,
  namedGraph: "",
  question: "", //text question
  information: [],
  SPARQLquery: "", //containes the generated sparql query
  json: "",
  loaded: false, //indicates if the backend already gave back the answer
  error: false,
  informationLoaded : [],
  informationError: [],

}

export default function qaReducer(state = initialState, action){
  switch (action.type) {
    case QANARY_REQUEST: {
      return {
        ...state,
        uriInput: false,
        namedGraph: "",
        information: [],
        informationLoaded : [],
        SPARQLquery: "",
        json: "",
        loaded: false,
        error: false,
      }
      break;
    }
    case QANARY_SUCCESS: {
      var tmp = new Array(action.information.length);
      for (var i = 0; i < tmp.length; i++) {
        tmp[i]=false;
        //Do something
      }
      return {
        ...state,
        namedGraph: action.namedGraph,
        information: action.information.concat(),
        informationLoaded: tmp,
        SPARQLquery: action.SPARQLquery,
        json: action.json,
        loaded: true,
        error: false,
      }
      break;
    }
    case QANARY_FAILURE: {
      return {
        ...state,
        error: action.error,
        loaded: true,
      }
      break;
    }
    case SET_QUESTION: {
      return {
        ...state,
        question: action.question,
      }
      break;
    }
    case ITEM_KNOWLEDGEBASE_REQUEST: {
      return {
        ...state,
        informationLoaded: [
          ...state.informationLoaded.slice(0, action.index),
          false,
          ...state.informationLoaded.slice(action.index + 1)
        ],
      }
      break;
    }
    case ITEM_KNOWLEDGEBASE_SUCCESS: {
      return {
        ...state,
        information: [
            ...state.information.slice(0, action.index),
            action.information,
            ...state.information.slice(action.index+1)
          ],
        informationLoaded: [
            ...state.informationLoaded.slice(0, action.index),
            true,
            ...state.informationLoaded.slice(action.index + 1)
          ],
      }
      break;
    }
    case ITEM_KNOWLEDGEBASE_FAILURE: {
      return {
        ...state,
        informationError: [
          ...state.informationError.slice(0, action.index),
          action.error,
          ...state.informationError.slice(action.index + 1)
        ],
      }
      break;
    }
  }
  return state;
}
