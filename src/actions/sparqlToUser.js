/**
 * Created by Dennis on 16/05/17.
 */

import {sparqlToUserEndpoint} from '../config';

export const SPARQL_TO_USER_REQUEST = 'SPARQL_TO_USER_REQUEST';
export const SPARQL_TO_USER_SUCCESS = 'SPARQL_TO_USER_SUCCESS';
export const SPARQL_TO_USER_FAILURE = 'SPARQL_TO_USER_FAILURE';



export function sparqlToUser(sparql, lang, knowledgebase){
  return function (dispatch) {
    dispatch({type: SPARQL_TO_USER_REQUEST});
    $.ajax({
      url: sparqlToUserEndpoint,
      type: "POST",
      contentType: 'application/x-www-form-urlencoded',
      data: {sparql: sparql, lang: lang, kb: knowledgebase},
      success: function (result) {
        console.log("RESULTTTTT",result);
        dispatch({type: SPARQL_TO_USER_SUCCESS, interpretation: result.interpretation});
      },
      error: function (e) {
        dispatch({type: SPARQL_TO_USER_FAILURE, error: e});
      }
    })
  }
}
