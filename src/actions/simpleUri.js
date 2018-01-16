/**
 * Created by Dennis on 11/11/16.
 */

import {json_to_list} from '../actions/qanary';
import {endpoint} from '../config';
import {QANARY_REQUEST, QANARY_SUCCESS, QANARY_FAILURE} from "./qanary";
import {info2} from "./knowledge_base/info2";

export function simpleUri(question, uri, knowledgebase){

  return function (dispatch) {

    //check whether the question input is a string or mp3file
    dispatch({type: QANARY_REQUEST, question: question});
    var sparqlQuery = "SELECT ?s0 where { VALUES ?s0 { <"+uri+"> } }";
    var url = endpoint+knowledgebase+"/sparql?query=" + encodeURIComponent(sparqlQuery);
    console.log(url);
    return $.ajax({
      url: url,
      type: "GET",
      success: function (data) {
        console.log("This is what we are receiving: ", data);
        dispatch({type: 'SET_QUESTION', question: question});
        dispatch({
          type: QANARY_SUCCESS,
          SPARQLquery: [{query: sparqlQuery, confidence: "1.0^^http://www.w3.org/2001/XMLSchema#double", kb: knowledgebase, score: 1}],
          json: data,
          information: json_to_list(data, knowledgebase),
          loaded: true,
        });
        dispatch(info2(knowledgebase,data,sparqlQuery));
      },
      error: function(e){
        var information = [];
        information.push({
          message: e.statusCode + " " + e.statusText,
        });
        dispatch({type: QANARY_FAILURE, error: true, information: information, loaded: true});
      }
    });
  }
}


