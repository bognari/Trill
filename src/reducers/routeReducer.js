/**
 * Created by Dennis on 30/06/17.
 */

import { ROUTE_CHANGE} from '../actions/route'

const initialStateRoute = {
  location: "/", //where the user is currently in the website
  question: "",
}

export default function routeReducer(state = initialStateRoute, action){
  switch (action.type) {
    case ROUTE_CHANGE: {
      return {
        ...state,
        location: action.location,
        query: action.query,
        kb: action.kb,
        lang: action.lang
      }
      break;
    }
  }
  return state;
}
