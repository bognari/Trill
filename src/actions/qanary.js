/**
 * Created by Dennis on 11/11/16.
 */

import iri from 'iri';

import {sparqlToUser} from '../actions/sparqlToUser';
import {qanary_services, dbpedia_endpoint, wikidata_endpoint, text_pipeline, audio_pipeline} from '../config';

export const QANARY_REQUEST = 'QANARY_REQUEST';
export const QANARY_SUCCESS = 'QANARY_SUCCESS';
export const QANARY_FAILURE = 'QANARY_FAILURE';

export function questionansweringfull(question, lang, knowledgebase, namedGraph){

  return function (dispatch) {
    console.log("GGGG");
    console.log(knowledgebase.join(", "));
    if (lang==null){
      lang = ["en"];
    }
    if (knowledgebase==null){
      knowledgebase= ["wikidata"];
    }
    console.log("CALLED",typeof namedGraph);

    var form  = new FormData();
    var components = "";
    if(typeof namedGraph != 'undefined'){
      components = "QueryExecuter";
      form.append("graph", namedGraph);
    }
    else {
      components = "wdaqua-core1-scigraph, QueryExecuter";
    }

    //check whether the question input is a string or mp3file
    dispatch({type: QANARY_REQUEST, question: question});
    if(typeof question === 'string') {
      form.append("textquestion", question);
    }
    else if(question == 100){
      //this is a message from SPARQLlist that the question is not the be sent to
      //the API
    }
    else {
      dispatch({type: QANARY_REQUEST, question: ""});
      form.append("audioquestion", question, "recording.mp3");
      components = audio_pipeline+", " + components;
    }
    form.append("componentlist[]", [components]);
    form.append("language[]", lang.join(", "));
    form.append("targetdata[]", knowledgebase.join(", "));

    var questionresult = $.ajax({
      url: qanary_services+"/questionansweringfull",
      data: form,
      processData: false,
      type: "POST",
      contentType: false,
      success: function (data) {
        console.log("This is what we are receiving: ", data);

        if(typeof question != 'string') {
          dispatch({type: 'SET_QUESTION', question: data.textrepresentation});
        }

        var query = [];
        for(var i=0; i<data.sparql.length; i++) {
          query.push({
            query:data.sparql[i].query,
            confidence:data.sparql[i].confidence,
            kb:data.sparql[i].kb,
            score: data.sparql.length-i});
          //Here we receive the question converted to a query (first one in an array of ranked possible queries)
        }
        // if (query.length>0){
        //   dispatch(sparqlToUser(query[0], lang, knowledgebase));
        // }
        var namedGraph = data.namedgraph;
        var jresult = JSON.parse(data.json);
        console.log(jresult);
        dispatch({
          type: QANARY_SUCCESS,
          namedGraph: namedGraph,
          SPARQLquery: query,
          json: jresult,
          information: json_to_list(jresult, query[0].kb),
          loaded: true,
        });


      },
      sparqlInterpretationError: function(e){
        var information = [];
        information.push({
          message: e.statusCode + " " + e.statusText,
        });
        dispatch({type: QANARY_FAILURE, error: true, information: information, loaded: true});
      }
    });
  }
}

function json_to_list(jresult, kb){
  var results = [];
  if (jresult.hasOwnProperty("boolean")) {
    results.push({
      type: "literal",
      value: (jresult.boolean == true) ? "True" : "False",
    })
  } else {
    var variable=jresult.head.vars[0];

    if(jresult.results.bindings.length > 0 && jresult.results.bindings.length <= 1000) {
      jresult.results.bindings.map(function(binding,k) {
        results.push({
          type : binding[variable].type,
          datatype: (binding[variable].hasOwnProperty("datatype") ? binding[variable].datatype : null),
          value : binding[variable].value,
          kb : kb,

        })
      })
    }
  }
  return results;
}


