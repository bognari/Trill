/**
 * Created by Dennis on 08/11/16.
 */

/*
 * action types
 */

export const KNOWLEDGEBASE_CHANGE = 'KNOWLEDGEBASE_CHANGE'

/*
 * other constants
 */

/*
 * action creators
 */

export function setKnowledgebase(k){
  return function (dispatch) {
    dispatch({type: KNOWLEDGEBASE_CHANGE, knowledgebase: k});
  }
}
