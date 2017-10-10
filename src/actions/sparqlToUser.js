/**
 * Created by Dennis on 16/05/17.
 */

import store from '../stores/index';
import {sparqlToUserEndpoint} from '../config';

export const SPARQL_TO_USER_REQUEST = 'SPARQL_TO_USER_REQUEST';
export const SPARQL_TO_USER_SUCCESS = 'SPARQL_TO_USER_SUCCESS';
export const SPARQL_TO_USER_FAILURE = 'SPARQL_TO_USER_FAILURE';



export function sparqlToUser(index, lang){
  console.log(store.getState().qa.SPARQLquery[index])
  var query = store.getState().qa.SPARQLquery[index];
  return function (dispatch) {
    console.log("SPARQLTOUSER");
    dispatch({type: SPARQL_TO_USER_REQUEST});
    $.ajax({
      url: sparqlToUserEndpoint,
      type: "POST",
      contentType: 'application/x-www-form-urlencoded',
      data: {sparql: query.query, lang: lang, kb: query.kb},
      success: function (result) {
        console.log("BLUUU");
        console.log(result);
        dispatch({type: SPARQL_TO_USER_SUCCESS, index: index, sparqlInterpretation: result.interpretation});
      },
      sparqlInterpretationError: function (e) {
        dispatch({type: SPARQL_TO_USER_FAILURE, index: index, error: e});
      }
    })
  }
}
