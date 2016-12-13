/**
 * Created by Dennis on 08/11/16.
 */

/*
 * action types
 */

export const LANGUAGE_CHANGE = 'LANGUAGE_CHANGE'
export const SET_QUESTION = 'SET_QUESTION'

/*
 * other constants
 */

/*
 * action creators
 */

export function setLanguage(lang){
  return function (dispatch) {
    dispatch({type: LANGUAGE_CHANGE, language: lang});
  }
}
