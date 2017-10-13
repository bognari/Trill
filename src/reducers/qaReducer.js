/**
 * Created by Dennis on 30/06/17.
 */

import { QANARY_REQUEST, QANARY_SUCCESS, QANARY_FAILURE, } from '../actions/qanary'
import {ITEM_KNOWLEDGEBASE_REQUEST, ITEM_KNOWLEDGEBASE_SUCCESS, ITEM_KNOWLEDGEBASE_FAILURE} from '../actions/knowledge_base/knowledgeBase'
import { SPARQL_TO_USER_REQUEST, SPARQL_TO_USER_SUCCESS, SPARQL_TO_USER_FAILURE} from '../actions/sparqlToUser'

export const SET_QUESTION = 'SET_QUESTION';

const initialState = {
  uriInput: true,
  namedGraph: "",
  question: "", //text question
  information: [],
  SPARQLquery: [], //containes the generated sparql query
  json: "",
  informationLoaded : [],
  informationError: [],
  sparqlInterpretationError: [],
  sparqlInterpretationloading: [],
  sparqlInterpretationloaded: [],
  loaded: false,
  error: false,
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
      }
      break;
    }
    case QANARY_SUCCESS: {
      var tmp1 = new Array(action.information.length);
      for (var i = 0; i < tmp1.length; i++) {
        tmp1[i]=false;
        //Do something
      }
      var tmp2 = new Array(action.SPARQLquery.length);
      for (var i = 0; i < tmp2.length; i++) {
        tmp2[i]=Object.assign({},action.SPARQLquery[i]);
        //Do something
      }
      var tmp3 = new Array(action.SPARQLquery.length);
      for (var i = 0; i < tmp3.length; i++) {
        tmp3[i]=false;
        //Do something
      }
      var tmp4 = new Array(action.SPARQLquery.length);
      for (var i = 0; i < tmp4.length; i++) {
        tmp4[i]=false;
        //Do something
      }
      var newArr = action.SPARQLquery.slice();
      return {
        ...state,
        namedGraph: action.namedGraph,
        information: action.information.concat(),
        informationLoaded: tmp1.concat(),
        SPARQLquery: tmp2.concat(),
        sparqlInterpretationloaded: tmp3.concat(),
        sparqlInterpretationloading: tmp4.concat(),
        json: action.json,
        loaded: true,
      }
      break;
    }
    case QANARY_FAILURE: {
      return {
        ...state,
        error: action.sparqlInterpretationError,
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
      console.log("SUCCESS");
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
          action.sparqlInterpretationError,
          ...state.informationError.slice(action.index + 1)
        ],
      }
      break;
    }
    case SPARQL_TO_USER_REQUEST: {

      return {
        ...state,
        sparqlInterpretationloading: [
          ...state.sparqlInterpretationloading.slice(0, action.index),
          true,
          ...state.sparqlInterpretationloading.slice(action.index + 1)
        ],
      }
      break;
    }
    case SPARQL_TO_USER_SUCCESS: {

      return {
        ...state,
        SPARQLquery: [
          ...state.SPARQLquery.slice(0, action.index),
          {...state.SPARQLquery[action.index], interpretation: action.sparqlInterpretation},
          ...state.SPARQLquery.slice(action.index + 1)
          ],
        sparqlInterpretationloaded: [
          ...state.sparqlInterpretationloaded.slice(0, action.index),
          true,
          ...state.sparqlInterpretationloaded.slice(action.index + 1)
        ],
      }
      break;
    }
    case SPARQL_TO_USER_FAILURE: {
      return {
        ...state,
        sparqlInterpretationError:  [
          ...state.sparqlInterpretationError.slice(0, action.index),
          action.error,
          ...state.sparqlInterpretationError.slice(action.index + 1)
        ],
      }
      break;
    }
  }
  return state;
}
