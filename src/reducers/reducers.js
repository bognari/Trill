/**
 * Created by Dennis on 08/11/16.
 */

import { combineReducers } from 'redux'

import qaReducer from '../reducers/qaReducer'
import languageReducer from '../reducers/languageReducer'
import knowledgebaseReducer from '../reducers/knowledgebaseReducer'
import routeReducer from '../reducers/routeReducer'

export default combineReducers({
  qa: qaReducer,
  lang: languageReducer,
  route: routeReducer,
  knowledgebase: knowledgebaseReducer,
})
