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
    if (lang==null){
      lang = "en";
    }
    if (knowledgebase==null){
      knowledgebase= "wikidata";
    }
    console.log("CALLED");

    var form  = new FormData();
    var components = "";
    if(typeof namedGraph != 'undefined'){
      components = "QueryExecuter";
      form.append("graph", namedGraph);
    }
    else if(knowledgebase=="wikidata"){
      components = "wdaqua-core0-wikidata, QueryExecuter";
    }
    else if(knowledgebase=="musicbrainz"){
      components = "wdaqua-core0-musicbrainz, QueryExecuter";
    }
    else{
      components = text_pipeline;
    }

    //check whether the question input is a string or mp3file
    if(typeof question === 'string') {
      dispatch({type: QANARY_REQUEST, question: question});
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
    form.append("language", lang);

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
          query[i] = {query:data.sparql[i] , score: data.sparql.length-i};
          //Here we receive the question converted to a query (first one in an array of ranked possible queries)
        }
        if (query.length>0){
          dispatch(sparqlToUser(query[0].query, lang, knowledgebase));
        }
        var namedGraph = data.namedgraph;
        var jresult = JSON.parse(data.json);
        console.log(jresult);
        dispatch({
          type: QANARY_SUCCESS,
          namedGraph: namedGraph,
          SPARQLquery: query,
          json: jresult,
          information: json_to_list(jresult),
          loaded: true,
        });


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

function json_to_list(jresult){
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

        })
      })
    }
  }
  return results;
}

function configureResult(query, jresult, lang, namedGraph){
  return function (dispatch){
  var count = 0;

    var variable=jresult.head.vars[0];
    var information=[];
    console.log(jresult.results.bindings.length, "  --- ", );
    //depending on the number of results, handle accordingly:
    if(jresult.results.bindings.length > 0 && jresult.results.bindings.length <= 1000) {
      jresult.results.bindings.map(function(binding,k) {
        if (k<20) {
          var type = binding[variable].type;
          var value = binding[variable].value;
          console.log("Result type and value: " + type + "; " + value);

          if (type == "uri") {
            //There is only one uri
            var sparqlQuery = "select ?label ?abstract ?image ?lat ?long ?wikilink where { "
              + " OPTIONAL{ "
              + "<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\"" + lang + "\")"
              + "} "
              + " OPTIONAL{ "
              + "<" + value + "> dbo:thumbnail ?image . "
              + "} "
              + " OPTIONAL{ "
              + "<" + value + "> dbo:abstract ?abstract . FILTER (lang(?abstract)=\"" + lang + "\") "
              + "} "
              + " OPTIONAL{ "
              + "<" + value + "> geo:lat ?lat . "
              + "} "
              + " OPTIONAL{ "
              + "<" + value + "> geo:long ?long . "
              + "} "
              + " OPTIONAL{ "
              + "?wikilink foaf:primaryTopic <" + value + "> . "
              + "} "
              // + " FILTER (lang(?label)=\"en\" && lang(?abstract)=\"en\") "
              + " } ";

            var wikiSparqlQuery = "PREFIX dbo: <urn:dbo> " +
              "select ?label ?abstract ?image ?lat ?long ?wikilink where { " +
              "OPTIONAL{ " +
              //"<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" || lang(?label)=\"de\" || lang(?label)=\"fr\" || lang(?label)=\"it\")" +
              "<" + value + "> rdfs:label ?label . FILTER (lang(?label)=?lang) . " +
              " values (?lang ?lang_) { (\""+lang+"\" 1) (\"en\" 2) (\"de\" 3) (\"fr\" 4) (\"it\" 5)} " + //Trick to find the labels if they do not exist in the desired language, otherwise the "Q number" appears which is ugly
              "} " +
              "OPTIONAL{ " +
              "<" + value + "> wdt:P18 ?image . " +
              "} " +
              "OPTIONAL{ " +
              "<" + value + "> dbo:abstract ?abstract . FILTER (lang(?abstract)=\"" + lang + "\" ) " +
              "} " +
              "OPTIONAL{ " +
              "<" + value + "> wdt:P625 ?lat . " +
              "} " +
              "OPTIONAL{ " +
              "?wikilink a schema:Article ; schema:about <" + value + "> ; schema:inLanguage \""+ lang +"\" ; schema:isPartOf <https://"+lang+".wikipedia.org/> ." +
              "} " +
              "} order by ?lang_ ";

            var dbpediaQueryUrl = dbpedia_endpoint+"?query=" + encodeURIComponent(sparqlQuery) + "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on";
            var wikiQueryUrl = wikidata_endpoint+"?query=" + encodeURIComponent(wikiSparqlQuery) + "&format=json";


            var getpropertiesrequest = $.get((value.indexOf("wikidata") > -1) ? wikiQueryUrl : dbpediaQueryUrl);

            getpropertiesrequest.success(function(result){

                //in the case of wikidata the abstract needs to be retrieved from wikipedia and the image needs to be shrinked
                var wikiabstract = "";
                if(value.indexOf("wikidata") > -1 && result.results.bindings[0].wikilink != null){

                    //Shrink the image size
                    if (result.results.bindings[0].image != undefined){
                      result.results.bindings[0].image.value +="?width=300";
                    }

                    $.ajax({
                      url: "https://"+lang+".wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&origin=*&explaintext=&titles=" + iri.toIRIString(result.results.bindings[0].wikilink.value.replace("https://"+lang+".wikipedia.org/wiki/","")).replace("%20","_"),
                      async: false,
                      type: "GET",
                      contentType: false,
                      success: function (data) {
                        for(var key in data.query.pages){
                          if(data.query.pages.hasOwnProperty(key)){
                            wikiabstract = data.query.pages[key].extract;
                            if (wikiabstract!=undefined){
                              setinformation(binding,result,wikiabstract, jresult);
                            } else {
                              setinformation(binding,result,"", jresult);
                            }
                          }
                        }
                      }
                    });
                }

                else {
                  setinformation(binding, result, "", jresult);
                }

                function setinformation(binding, result, wikiabstract, jresult){
                  //to refactor the following if statements to one switch statement? I.e. do a checks on the result to
                  //determine and set answertype
                  if (Object.keys(result.results.bindings[0]).length == 0) { //Case when there is no information... is it a possible scenario?
                    information.push({
                      label: value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
                      answertype: "noinfo",
                      uri: value,
                      link: value,
                      key: k,
                    })
                    dispatch({
                      type: QANARY_SUCCESS,
                      namedGraph: namedGraph,
                      SPARQLquery: query,
                      json: jresult,
                      information: information,
                      loaded: true,
                    });
                  }

                  else if (result.results.bindings[0].lat != undefined) { //case there are geo coordinates

                    if(result.results.bindings[0].long ==  undefined) {
                      var coordinates = result.results.bindings[0].lat.value.replace("Point(", "").replace(")", "").split(" ");
                    }

                    information.push({
                      label: (result.results.bindings[0].label != undefined) ? result.results.bindings[0].label.value : value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
                      abstract: (result.results.bindings[0].abstract != undefined) ? result.results.bindings[0].abstract.value : (wikiabstract != "") ? wikiabstract : "",
                      image: (result.results.bindings[0].image != undefined) ? result.results.bindings[0].image.value : "",
                      answertype: "map",
                      uri: value,
                      link: (result.results.bindings[0].wikilink != undefined) ? result.results.bindings[0].wikilink.value : null,
                      key: k,
                      lat: (result.results.bindings[0].long ==  undefined) ? parseFloat(coordinates[1]) : parseFloat(result.results.bindings[0].lat.value),
                      long: (result.results.bindings[0].long ==  undefined) ? parseFloat(coordinates[0]) : parseFloat(result.results.bindings[0].long.value),
                    })
                    dispatch({
                      type: QANARY_SUCCESS,
                      namedGraph: namedGraph,
                      SPARQLquery: query,
                      json: jresult,
                      information: information,
                      loaded: true,
                    });
                  }

                  else {//case of regular detailed answer

                    information.push({
                      label: (result.results.bindings[0].label != undefined) ? result.results.bindings[0].label.value : value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
                      abstract: (result.results.bindings[0].abstract != undefined) ? result.results.bindings[0].abstract.value : (wikiabstract != "") ? wikiabstract : "",
                      image: (result.results.bindings[0].image != undefined) ? result.results.bindings[0].image.value : "",
                      answertype: "detail",
                      uri: value,
                      link: (result.results.bindings[0].wikilink != undefined) ? result.results.bindings[0].wikilink.value : null,
                      key: k,
                    })
                    dispatch({
                      type: QANARY_SUCCESS,
                      namedGraph: namedGraph,
                      SPARQLquery: query,
                      json: jresult,
                      information: information,
                      loaded: true,
                    });
                  }
                }
            });
          }
          else if (type == "typed-literal" || type == "literal") {
            information.push({
              label: binding[variable].value,
              answertype: "simple",
              key: k,
            })
            dispatch({
              type: QANARY_SUCCESS,
              namedGraph: namedGraph,
              SPARQLquery: query,
              json: jresult,
              information: information,
              loaded: true,
            });
          }
        }
      })
    }
    else { //if there are no results
      var information = [];
      information.push({
        label: "No results",
        answertype: "simple",
      });
      dispatch({
        type: QANARY_SUCCESS,
        namedGraph: namedGraph,
        SPARQLquery: query,
        json: jresult,
        information: information,
        loaded: true,
        answertype: "simple"
      });
    }
  }
}


