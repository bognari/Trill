/**
 * Created by Dennis on 11/11/16.
 */

import iri from 'iri';

import {sparqlToUser} from '../actions/sparqlToUser';
import {qanary_services, dbpedia_endpoint, wikidata_endpoint, text_pipeline, audio_pipeline} from '../config';

export const QANARY_PUSH_REQUEST = 'QANARY_PUSH_REQUEST';
export const QANARY_PUSH_SUCCESS = 'QANARY_PUSH_SUCCESS';
export const QANARY_PUSH_FAILURE = 'QANARY_PUSH_FAILURE';

import {questionansweringfull} from "./qanary";
import {qanary_endpoint} from '../config';


export function pushQueries(sparqlList, language, knowledgebase, namedGraph){
  return function (dispatch) {
    var sparqlPart1 = "";
    var sparqlPart2 = "";
    for (var i = 0; i < Math.min(sparqlList.length, 30); i++) {
      sparqlPart1 += " ?a" + i + " a qa:AnnotationOfAnswerSPARQL . "
        + "  ?a" + i + " oa:hasTarget <URIAnswer> . "
        + "  ?a" + i + " oa:hasBody \"" + sparqlList[i].query.replace("\n", " ") + "\" ;"
        + "     oa:annotatedBy <www.wdaqua.eu> ; "
        + "         oa:annotatedAt ?time ; "
        + "         qa:hasScore " + sparqlList[i].score + " ;  "
        + "         qa:overKb \"" + knowledgebase + "\" .  \n ";
      sparqlPart2 += " BIND (IRI(str(RAND())) AS ?a" + i + ") . \n";
    }

    var sparql = "prefix qa: <http://www.wdaqua.eu/qa#> "
      + "prefix oa: <http://www.w3.org/ns/openannotation/core/> "
      + "INSERT { "
      + "GRAPH <" + namedGraph + "> { "
      + sparqlPart1
      + " }} "
      + "WHERE { "
      + sparqlPart2
      + "BIND (IRI(str(RAND())) AS ?b) . "
      + "BIND (now() as ?time) . "
      + "}";

    dispatch({type: QANARY_PUSH_REQUEST, list: sparqlList});
    $.ajax({
      url: qanary_endpoint,
      type: "POST",
      contentType: 'application/x-www-form-urlencoded',
      data: {query: sparql},
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa("admin:admin"));
        xhr.setRequestHeader('Accept', 'application/sparql-results+json');
      },
      success: function (result) {
        var information = [];
        information.push({
          message: result,
        });
        dispatch({type: QANARY_PUSH_SUCCESS, error: true, information: information});
        dispatch(questionansweringfull(100, language, knowledgebase, namedGraph));
      },
      error: function (e) {
        var information = [];
        information.push({
          message: e.statusCode + " " + e.statusText,
        });
        dispatch({type: QANARY_PUSH_FAILURE, error: true, information: information});
      }
    })
  }
}


