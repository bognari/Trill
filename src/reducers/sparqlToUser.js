/**
 * Created by Dennis on 16/05/17.
 */

import { SPARQL_TO_USER_REQUEST, SPARQL_TO_USER_SUCCESS, SPARQL_TO_USER_FAILURE} from '../actions/sparqlToUser'

const initialState = {
  interpretation: "",
  error: "",
  loaded: false,
}

export default function sparqlToUserReducer (state = initialState, action){
  switch (action.type) {
    case SPARQL_TO_USER_REQUEST: {
      return {
        ...state,
        loaded: false,
      }
      break;
    }
    case SPARQL_TO_USER_SUCCESS: {
      return {
        ...state,
        interpretation: action.interpretation,
        loaded: true,
      }
      break;
    }
    case SPARQL_TO_USER_FAILURE: {
      return {
        ...state,
        error: action.error,
        loaded: false,
      }
      break;
    }
  }
  return state;
}
