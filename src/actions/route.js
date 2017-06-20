/**
 * Created by Dennis on 08/11/16.
 */

/*
 * action types
 */

export const ROUTE_CHANGE = 'ROUTE_CHANGE'


/*
 * action creators
 */

export function routechange(path, query, lang){
  return function (dispatch) {
    dispatch({type: ROUTE_CHANGE, location: path, query: query, language: lang});
  }
}
