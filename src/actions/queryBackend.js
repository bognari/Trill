/**
 * Created by Dennis on 11/11/16.
 */

import Location from '../core/Location';

export const QUESTION_ANSWERING_REQUEST = 'QUESTION_ANSWERING_REQUEST';
export const QUESTION_ANSWERING_SUCCESS = 'QUESTION_ANSWERING_SUCCESS';
export const QUESTION_ANSWERING_FAILURE = 'QUESTION_ANSWERING_FAILURE';
export const QUESTION_ANSWERING_ENTITY_CHANGE = 'QUESTION_ANSWERING_ENTITY_CHANGE';
export const ROUTE_CHANGE = 'ROUTE_CHANGE';

const qanary_endpoint =  "https://wdaqua-endpoint.univ-st-etienne.fr/qanary/query";
const qanary_services =  "https://wdaqua-qanary.univ-st-etienne.fr";
const dbpedia_endpoint = "https://dbpedia.org/sparql";

export function startQuestionAnsweringWithTextQuestion(question){
  return function (dispatch) {
    dispatch({type: QUESTION_ANSWERING_REQUEST, question: question});
    //dispatch({type: QUESTION_ANSWERING_REQUEST});
    var questionresult = $.post(qanary_services+"/startquestionansweringwithtextquestion", "question=" + encodeURIComponent(question) + "&componentlist[]=wdaqua-core0, QueryExecuter", function (data) {
      sendQueryToEndpoint(data, dispatch);
    });

    questionresult.fail(function (e) {
      dispatch({type: QUESTION_ANSWERING_FAILURE, error: true, loaded: true});
    })
  }
}

export function startQuestionAnsweringWithAudioQuestion(mp3file){
  return function (dispatch) {
    dispatch({type: QUESTION_ANSWERING_REQUEST, question: ''});
    var form  = new FormData();
    //form.append("question", mpblob); //this also works, but need to test if there is a difference to the service if we give blob or file
    form.append("question", mp3file, "recording.mp3");
    form.append("componentlist[]", ["SpeechRecognitionKaldi, wdaqua-core0, QueryExecuter"]);

    //maybe should check if mpfile is proper

    console.log("mp3 file :", mp3file);
    console.log("Contents of form: ", form);

    var questionresult = $.ajax({
      url: qanary_services+"/startquestionansweringwithaudioquestion",
      data: form,
      processData: false,
      type: "POST",
      contentType: false,
      success: function (data) {
        retriveQuestion(data, dispatch);
        sendQueryToEndpoint(data, dispatch);
      }
    });

    questionresult.fail(function (e) {
      var information = this.state.information;
      information.push({
        message: e.statusCode + " " + e.statusText,
      });
      dispatch({type: QUESTION_ANSWERING_FAILURE, error: true, information: information, loaded: true});
    })
  }
}

export function questionanswering(namedGraph, components){
  return function (dispatch) {
    dispatch({type: QUESTION_ANSWERING_ENTITY_CHANGE});

    var form = new FormData();
    form.append("componentlist[]", components);
    form.append("qanaryMessage", JSON.stringify({
      "values": {
        "http://qanary/#endpoint": qanary_endpoint,
        "http://qanary/#inGraph": namedGraph,
        "http://qanary/#outGraph": namedGraph
      },
      "endpoint": qanary_endpoint,
      "outGraph": namedGraph,
      "inGraph": namedGraph
    }));

    var executeQuery = $.ajax({
      url: qanary_services+"/questionanswering",
      type: "POST",
      data: form,
      processData: false,
      contentType: false,
      success: function (data) {
        retriveQuestion(data);
        sendQueryToEndpoint(data, dispatch);
      }
    });
  }
}

function retriveQuestion(data, dispatch){
  console.log("Retrieve question text");
  var namedGraph = data.graph.toString();
  var sparqlQuery =  "PREFIX qa: <http://www.wdaqua.eu/qa#> "
    + "PREFIX oa: <http://www.w3.org/ns/openannotation/core/> "
    + "SELECT ?uriText "
    + "FROM <"+  namedGraph + "> "
    + "WHERE { "
    + "  ?c a qa:AnnotationOfTextRepresentation . "
    + "  ?c oa:hasBody ?uriText . "
    + "}";
  $.ajax({
    url: qanary_endpoint+"?query=" + encodeURIComponent(sparqlQuery),
    type: "GET",
    beforeSend: function(xhr){
      xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:admin"));
      xhr.setRequestHeader('Accept', 'application/sparql-results+json');
    },
    success: function(result) {
      console.log("RESULT");
      console.log(result);
      var uriText = result.results.bindings[0].uriText.value;
      console.log(uriText);
      uriText=uriText.replace("http://qanaryhost:8080/question/",qanary_services+"/question/")+"/raw";
      //Dereference the uri and retrieve the text
      $.ajax({
          url: uriText,
          type: "GET",
        success: function(result) {
            console.log(result);
            dispatch({type: 'SET_QUESTION', question: result});
            //dispatch({type: SET_AUDIO, audiofile: null});
            Location.push("/question?query="+result);
        },
        error: function (err){
            return err;
          }})
    },
    error: function (err){
      return err;
    }
  })
}

function sendQueryToEndpoint(data, dispatch){
  var namedGraph = data.graph.toString();
  var sparqlQuery =  "PREFIX qa: <http://www.wdaqua.eu/qa#> "
    + "PREFIX oa: <http://www.w3.org/ns/openannotation/core/> "
    + "SELECT ?sparql ?json ?score "
    + "FROM <"+  namedGraph + "> "
    + "WHERE { "
    + "  ?a a qa:AnnotationOfAnswerSPARQL . "
    + "  OPTIONAL {?a oa:hasBody ?sparql . } "
    + "  ?a qa:hasScore ?score . "
    + "  ?a oa:annotatedAt ?time1 . "
    + "  ?b a qa:AnnotationOfAnswerJSON . "
    + "  OPTIONAL {?b oa:hasBody ?json . } "
    + "  ?b oa:annotatedAt ?time2 . "
    + "  { "
    + "   select ?time1 { "
    + "    ?a a qa:AnnotationOfAnswerSPARQL . "
    + "    ?a oa:annotatedAt ?time1 "
    + "    } order by DESC(?time1) limit 1 "
    + "  } "
    + "  { "
    + "   select ?time2 { "
    + "    ?a a qa:AnnotationOfAnswerJSON . "
    + "    ?a oa:annotatedAt ?time2 "
    + "    } order by DESC(?time2) limit 1 "
    + "  } "
    + "} "
    + "ORDER BY DESC(?score)";

  $.ajax({
    url: qanary_endpoint+"?query=" + encodeURIComponent(sparqlQuery),
    type: "GET",
    beforeSend: function(xhr){
      xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:admin"));
      xhr.setRequestHeader('Accept', 'application/sparql-results+json');
    },
    success: function(result) {
      console.log("This is the resaulttttt....", result );
      var query = [];
      for(var i=0; i<result.results.bindings.length; i++) {
        query[i] = {query:result.results.bindings[i].sparql.value , score: parseInt(result.results.bindings[i].score.value)};
        //Here we receive the question converted to a query (first one in an array of ranked possible queries)
      }
      
      var jresult = JSON.parse(result.results.bindings[0].json.value);

      if (jresult.hasOwnProperty("boolean")) {
        var information = [];
        information.push({
          label: (jresult.boolean == true) ? "True" : "False",
          answertype: "simple",
        })
        dispatch({
          type: QUESTION_ANSWERING_SUCCESS,
          namedGraph: namedGraph,
          SPARQLquery: query,
          information: information,
          loaded: true,
        });
      }
      else if (jresult.head.vars[0]=="count") {
        configureResult(query, jresult, dispatch, namedGraph);
      } else{
        var variable=jresult.head.vars[0];
        var rankedSparql = "PREFIX vrank:<http://purl.org/voc/vrank#>" +
          "SELECT ?"+ variable + " " +
          "FROM <http://dbpedia.org>" +
          "FROM <http://people.aifb.kit.edu/ath/#DBpedia_PageRank>" +
          "WHERE {" +
          "{"+ query[0].query +"} " +
          "OPTIONAL { ?" + variable+ " vrank:hasRank/vrank:rankValue ?v. } " +
          "}" +
          "ORDER BY DESC(?v) LIMIT 1000";
        console.log(rankedSparql);

        var rankedrequest = $.get(
          dbpedia_endpoint+"?query="+encodeURIComponent(rankedSparql)+"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on",
          function (rankedresult) {
            console.log(rankedresult);
            configureResult(query, rankedresult, dispatch, namedGraph);

          }.bind(this)
        );
      }
    }
  });
}

function configureResult(query, jresult, dispatch, namedGraph){

  var count = 0;
  console.log('This is the json result (ranked): ', jresult);

    var variable=jresult.head.vars[0];
    var information=[];
    //depending on the number of results, handle accordingly:
    if(jresult.results.bindings.length > 0 && jresult.results.bindings.length <= 1000) {
      jresult.results.bindings.map(function(binding,k) {
        if (k<20) {
          console.log('In each iteration: ');
          console.log("k: " + k);

          var type = binding[variable].type;
          var value = binding[variable].value;
          console.log("Result type and value: " + type + "; " + value);

          if (type == "uri") {
            //There is only one uri
            var sparqlQuery = "select ?label ?abstract ?image ?lat ?long ?wikilink where { "
              + " OPTIONAL{ "
              + "<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\"en\")"
              + "} "
              + " OPTIONAL{ "
              + "<" + value + "> dbo:thumbnail ?image . "
              + "} "
              + " OPTIONAL{ "
              + "<" + value + "> dbo:abstract ?abstract . FILTER (lang(?abstract)=\"en\") "
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

            $.get(
              dbpedia_endpoint+"?query=" + encodeURIComponent(sparqlQuery) + "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on",
              function (result) {
                console.log("The properties of the results are this: ", result);

                //to refactor the following if statements to one switch statement? I.e. do a checks on the result to
                //determine and set answertype
                if (typeof result.results.bindings[0]=="undefined") { //Case when there is no information... is it a possible scenario?
                  information.push({
                    label: value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
                    answertype: "noinfo",
                    link: value,
                    key: k,
                  })
                  dispatch({
                    type: QUESTION_ANSWERING_SUCCESS,
                    namedGraph: namedGraph,
                    SPARQLquery: query,
                    information: information,
                    loaded: true,
                  });
                }

                else if (result.results.bindings[0].lat != undefined) { //case there are geo coordinates

                  console.log("Label: " + result.results.bindings[0].label.value);

                  information.push({
                    label: (result.results.bindings[0].label != undefined) ? result.results.bindings[0].label.value : value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
                    abstract: (result.results.bindings[0].abstract != undefined) ? result.results.bindings[0].abstract.value : "",
                    image: (result.results.bindings[0].image != undefined) ? result.results.bindings[0].image.value : "",
                    answertype: "map",
                    uri: value,
                    link: (result.results.bindings[0].wikilink != undefined) ? result.results.bindings[0].wikilink.value : value,
                    key: k,
                    lat: parseFloat(result.results.bindings[0].lat.value),
                    long: parseFloat(result.results.bindings[0].long.value),
                  })
                  dispatch({
                    type: QUESTION_ANSWERING_SUCCESS,
                    namedGraph: namedGraph,
                    SPARQLquery: query,
                    information: information,
                    loaded: true,
                  });
                }

                else {//case of regular detailed answer

                  console.log("Label: " + result.results.bindings[0].label.value);

                  information.push({
                    label: (result.results.bindings[0].label != undefined) ? result.results.bindings[0].label.value : value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
                    abstract: (result.results.bindings[0].abstract != undefined) ? result.results.bindings[0].abstract.value : "",
                    image: (result.results.bindings[0].image != undefined) ? result.results.bindings[0].image.value : "",
                    answertype: "detail",
                    uri: value,
                    link: (result.results.bindings[0].wikilink != undefined) ? result.results.bindings[0].wikilink.value : value,
                    key: k,
                  })
                  dispatch({
                    type: QUESTION_ANSWERING_SUCCESS,
                    namedGraph: namedGraph,
                    SPARQLquery: query,
                    information: information,
                    loaded: true,
                  });
                }
              })
          }
          else if (type == "typed-literal" || type == "literal") {
            information.push({
              label: binding[variable].value,
              answertype: "simple",
              key: k,
            })
            dispatch({
              type: QUESTION_ANSWERING_SUCCESS,
              namedGraph: namedGraph,
              SPARQLquery: query,
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
        type: QUESTION_ANSWERING_SUCCESS,
        namedGraph: namedGraph,
        SPARQLquery: query,
        information: information,
        loaded: true,
        answertype: "simple"
      });
    }
 // }
}

export function routeupdate(path, query){
  return function (dispatch) {
    dispatch({type: ROUTE_CHANGE, location: path, question: query});
  }
}
