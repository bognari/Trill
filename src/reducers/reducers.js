/**
 * Created by Dennis on 08/11/16.
 */

import { combineReducers } from 'redux'
import { LANGUAGE_CHANGE} from '../actions/language'
import { QUESTION_ANSWERING_REQUEST, QUESTION_ANSWERING_SUCCESS, QUESTION_ANSWERING_FAILURE, SET_QUESTION} from '../actions/queryBackend'
import { ROUTE_CHANGE} from '../actions/route'


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
  uriInput: true,
  }

const qaReducer = (state = initialState, action) => {
  switch (action.type) {
    case QUESTION_ANSWERING_REQUEST: {
      return {
        ...state,
        question: action.question,
        loaded: false,
        qinitiated: true,
        uriInput: false,
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
        error: false,
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
    case SET_QUESTION: {
      return {
        ...state,
        question: action.question,
    }
      break;
    }
  }
  return state;
}

const initialStateLanguage = {
  language: "en", //initial language of the website set to english
}

const languageReducer = (state = initialStateLanguage, action) => {
  switch (action.type) {
    case LANGUAGE_CHANGE: {
      return {
        ...state,
        language: action.language,
      }
      break;
    }
  }
  return state;
}

const initialStateRoute = {
  location: "/", //where the user is currently in the website
  question: "",
}

const routeReducer = (state = initialStateRoute, action) => {
  switch (action.type) {
    case ROUTE_CHANGE: {
      return {
        ...state,
        location: action.location,
        query: action.query,
      }
      break;
    }
  }
  return state;
}


export default combineReducers({
  qa: qaReducer,
  lang: languageReducer,
  route: routeReducer,
})
