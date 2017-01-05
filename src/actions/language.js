/**
 * Created by Dennis on 08/11/16.
 */

/*
 * action types
 */

export const LANGUAGE_CHANGE = 'LANGUAGE_CHANGE'

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
