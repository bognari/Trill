/**
 * Created by Dennis on 08/11/16.
 */

import { combineReducers } from 'redux'
import { ADD_QUESTION, FETCH_QUESTION_FULLFILLED, FIRST_PAGE } from '../actions/setQuestion'
import { QUESTION_ANSWERING_REQUEST, QUESTION_ANSWERING_SUCCESS, QUESTION_ANSWERING_FAILURE } from '../actions/queryBackend'
import { ROUTE_CHANGE } from '../routes';

import { actionTypes } from 'react-redux-form';


const initialState = {
  //firstPage: true,
  location: "", //where the user is currently in the website
  namedGraph: "",
  question: "", //text question
  information: [],
  SPARQLquery: "", //containes the generated sparql query
  query: false, //indicates if the answer or the query is displayed
  loaded: false, //indicates if the backend already gave back the answer
  error: false,
}

const qaReducer = (state = initialState, action) => {
  switch (action.type) {
    case QUESTION_ANSWERING_REQUEST: {
      return {
        ...state,
        //firstPage: false,
        question: action.question,
        loaded: false,
      }
      break;
    }
    case QUESTION_ANSWERING_SUCCESS: {
      return {
        ...state,
        //firstPage: false,
        namedGraph: action.namedGraph,
        //question: action.question, //do we need to set this again? Because when there is a click in the sparql componenet, this sets to empty string
        information: action.information.concat(),
        SPARQLquery: action.SPARQLquery,
        loaded: true
      }
      break;
    }
    case QUESTION_ANSWERING_FAILURE: {
      return {
        ...state,
        //firstPage: false,
        error: action.error,
        loaded: true
      }
      break;
    }
    case ROUTE_CHANGE: {
      return {
        ...state,
        location: action.location,
      }
      break;
    }
  }
  return state;
}


export default combineReducers({
  qa: qaReducer,
})
