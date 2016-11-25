/**
 * Created by Dennis on 08/11/16.
 */

import { combineReducers } from 'redux'
import { SET_QUESTION} from '../actions/setQuestion'
import { QUESTION_ANSWERING_REQUEST, QUESTION_ANSWERING_SUCCESS, QUESTION_ANSWERING_FAILURE, QUESTION_ANSWERING_ENTITY_CHANGE, ROUTE_CHANGE } from '../actions/queryBackend'
//import { ROUTE_CHANGE } from '../routes';
import { SET_AUDIO } from '../components/QueryBox/QueryBox';

import { actionTypes } from 'react-redux-form';


const initialState = {
  location: "", //where the user is currently in the website
  namedGraph: "",
  question: "", //text question
  information: [],
  SPARQLquery: "", //containes the generated sparql query
  query: false, //indicates if the answer or the query is displayed
  loaded: false, //indicates if the backend already gave back the answer
  error: false,
  audiofile: null,
  qinitiated: false,
  }

const qaReducer = (state = initialState, action) => {
  switch (action.type) {
    case QUESTION_ANSWERING_REQUEST: {
      return {
        ...state,
        question: action.question,
        loaded: false,
        qinitiated: true,
      }
      break;
    }
    case QUESTION_ANSWERING_SUCCESS: {
      return {
        ...state,
        namedGraph: action.namedGraph,
        information: action.information.concat(),
        SPARQLquery: action.SPARQLquery,
        loaded: true,
        error: false
      }
      break;
    }
    case QUESTION_ANSWERING_FAILURE: {
      return {
        ...state,
        error: action.error,
        loaded: true,
        information: []
      }
      break;
    }
    case QUESTION_ANSWERING_ENTITY_CHANGE: {
      return {
        ...state,
        loaded: false,
        qinitiated: true,
      }
      break;
    }
    case ROUTE_CHANGE: {
      return {
        ...state,
        location: action.location,
        //question: action.question,
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
    case SET_AUDIO: {
      return {
        ...state,
        audiofile: action.audiofile,
      }
      break;
    }
  }
  return state;
}


export default combineReducers({
  qa: qaReducer,
})
