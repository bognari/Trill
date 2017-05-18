/**
 * Created by Dennis on 16/05/17.
 */

import {LANGUAGE_CHANGE} from '../actions/language'
import { ROUTE_CHANGE} from '../actions/route'

const initialStateLanguage = {
  language: "en", //initial language of the website set to english
}

export default function languageReducer(state = initialStateLanguage, action){
  switch (action.type) {
    case LANGUAGE_CHANGE: {
      return {
        ...state,
        language: action.language,
      }
      break;
    }
    case ROUTE_CHANGE: {
      if (action.language!=undefined){
        return {
          ...state,
          language: action.language,
        }
      }
      break;
    }
  }
  return state;
}
