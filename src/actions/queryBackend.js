/**
 * Created by Dennis on 11/11/16.
 */

import Location from '../core/Location';
import iri from 'iri';

export const QUESTION_ANSWERING_REQUEST = 'QUESTION_ANSWERING_REQUEST';
export const QUESTION_ANSWERING_SUCCESS = 'QUESTION_ANSWERING_SUCCESS';
export const QUESTION_ANSWERING_FAILURE = 'QUESTION_ANSWERING_FAILURE';
export const SET_QUESTION = 'SET_QUESTION';

export const URI_INPUT = "URI_INPUT"

const qanary_endpoint =  "https://admin:admin@wdaqua-endpoint.univ-st-etienne.fr/qanary/query";
const qanary_services =  "https://wdaqua-qanary.univ-st-etienne.fr";
const dbpedia_endpoint = "https://dbpedia.org/sparql";

export function languageFeedback(namedGraph, lang, dispatch){
  var sparql = "prefix qa: <http://www.wdaqua.eu/qa#> "
    + "prefix oa: <http://www.w3.org/ns/openannotation/core/> "
    + "INSERT { "
    + "GRAPH <" + namedGraph + "> { "
    + "?a a qa:AnnotationOfQuestionLanguage . "
    + "?a oa:hasBody \"" +lang+ "\" ;"
    + "   oa:annotatedBy <www.wdaqua.eu/qa> ; "
    + "   oa:annotatedAt ?time ; "
    + " }} "
    + "WHERE { "
    + "BIND (IRI(str(RAND())) AS ?a) . "
    + "BIND (IRI(str(RAND())) AS ?b) . "
    + "BIND (now() as ?time) . "
    + "}";

  $.ajax({
    url: "http://wdaqua-endpoint.univ-st-etienne.fr/qanary/query",
    type: "POST",
    contentType: 'application/x-www-form-urlencoded',
    data: {query: sparql},
    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:admin"));
      xhr.setRequestHeader('Accept', 'application/sparql-results+json');
    },
    success: function (result) {
      questionanswering(namedGraph, ["wdaqua-core0-wikidata, QueryExecuter"],lang, dispatch);
    }.bind(this)
  })
}

export function startQuestionAnsweringWithTextQuestion(question, lang){
  return function (dispatch) {
    dispatch({type: QUESTION_ANSWERING_REQUEST, question: question});
    var questionresult = $.post(qanary_services+"/startquestionansweringwithtextquestion", "question=" + encodeURIComponent(question) + "&componentlist[]=", function (data) {
      var namedGraph = data.graph.toString();
      languageFeedback(namedGraph, lang, dispatch);
      //questionanswering(namedGraph, ["wdaqua-core0-wikidata, QueryExecuter"], dispatch);
      //sendQueryToEndpoint(data, dispatch);
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
    form.append("componentlist[]", ["SpeechRecognitionKaldi, wdaqua-core0-wikidata, QueryExecuter"]);

    var questionresult = $.ajax({
      url: qanary_services+"/startquestionansweringwithaudioquestion",
      data: form,
      processData: false,
      type: "POST",
      contentType: false,
      success: function (data) {
        retriveQuestion(data, dispatch);
        sendQueryToEndpoint(data, "en", dispatch);
      },
      error: function(e){
        var information = [];
        information.push({
          message: e.statusCode + " " + e.statusText,
        });
        dispatch({type: QUESTION_ANSWERING_FAILURE, error: true, information: information, loaded: true});
      }
    });
  }
}

export function questionanswering(namedGraph, components, lang, dispatch){
    //dispatch({type: QUESTION_ANSWERING_ENTITY_CHANGE});

    var form = new FormData();
    form.append("componentlist[]", components);
    form.append("qanaryMessage", JSON.stringify({
      "values": {
        "http://qanary/#endpoint": "http://admin:admin@wdaqua-endpoint.univ-st-etienne.fr/qanary/query",
        "http://qanary/#inGraph": namedGraph,
        "http://qanary/#outGraph": namedGraph
      },
      "endpoint": "http://admin:admin@wdaqua-endpoint.univ-st-etienne.fr/qanary/query",
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
        retriveQuestion(data, dispatch);
        sendQueryToEndpoint(data, lang, dispatch);
      },
      error: function (err){
        dispatch({type: QUESTION_ANSWERING_FAILURE, error: true, loaded: true});
      }
    });
}

function retriveQuestion(data, dispatch){

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

      var uriText = result.results.bindings[0].uriText.value;
      uriText=uriText.replace("http://qanaryhost:8080/question/",qanary_services+"/question/")+"/raw";
      //Dereference the uri and retrieve the text
      $.ajax({
          url: uriText,
          type: "GET",
        success: function(result) {
            console.log("Question retrieved: ", result);
            dispatch({type: 'SET_QUESTION', question: result});
            //dispatch({type: SET_AUDIO, audiofile: null});
            //Location.push("/question?query="+result);
        },
        error: function (err){
          dispatch({type: QUESTION_ANSWERING_FAILURE, error: true, loaded: true});
            return err;
          }})
    },
    error: function (err){
      dispatch({type: QUESTION_ANSWERING_FAILURE, error: true, loaded: true});
      return err;
    }
  })
}

function sendQueryToEndpoint(data, lang, dispatch){
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
      console.log("This is the raw result: ", result );
      var query = [];
      for(var i=0; i<result.results.bindings.length; i++) {
        query[i] = {query:result.results.bindings[i].sparql.value , score: parseInt(result.results.bindings[i].score.value)};
        //Here we receive the question converted to a query (first one in an array of ranked possible queries)
      }

      var jresult = JSON.parse(result.results.bindings[0].json.value);
      console.log("JSON resurl ", jresult);
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
      } else {
        var variable=jresult.head.vars[0];

        //check whether if the results are wikidata and then whether or not to rank the answers
        if(result.results.bindings[0].sparql.value.indexOf("wikidata") > -1){
          console.log('This is the json result (not ranked due to wikidata result): ', jresult);
          configureResult(query, jresult, lang, dispatch, namedGraph);
        }
        else {

          var rankedSparql = "PREFIX vrank:<http://purl.org/voc/vrank#>" +
            "SELECT ?"+ variable + " " +
            "FROM <http://dbpedia.org>" +
            "FROM <http://people.aifb.kit.edu/ath/#DBpedia_PageRank>" +
            "WHERE {" +
            "{"+ query[0].query +"} " +
            "OPTIONAL { ?" + variable+ " vrank:hasRank/vrank:rankValue ?v. } " +
            "}" +
            "ORDER BY DESC(?v) LIMIT 1000";

          var rankedrequest = $.get(
            "http://dbpedia.org/sparql?query="+encodeURIComponent(rankedSparql)+"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on",
            function (rankedresult) {

              console.log('This is the json result (ranked): ', rankedresult);
              configureResult(query, rankedresult, lang, dispatch, namedGraph);

            }.bind(this));
        }
      }
    }
  });
}

function configureResult(query, jresult, lang, dispatch, namedGraph){

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
              "<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" ) " +
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
              "}";

            var dbpediaQueryUrl = "http://dbpedia.org/sparql?query=" + encodeURIComponent(sparqlQuery) + "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on";
            var wikiQueryUrl = "https://query.wikidata.org/sparql?query=" + encodeURIComponent(wikiSparqlQuery) + "&format=json";

            var getpropertiesrequest = $.get(
              (value.indexOf("wikidata") > -1) ? wikiQueryUrl : dbpediaQueryUrl);

            getpropertiesrequest.success(function(result){
                console.log("The properties of the results are: ", result);

                //in the case the abstract needs to be retrieved from wikipedia
                var wikiabstract = "";
                if(value.indexOf("wikidata") > -1 && result.results.bindings[0].wikilink != null){

                    //The following has been commented out because we cannot do the request due to access-control origin header missing

                    // $.ajax({
                    //   url: "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + result.results.bindings[0].wikilink.value.replace("https://en.wikipedia.org/wiki/",""),
                    //   async: false,
                    //   type: "GET",
                    //   contentType: false,
                    //   success: function (data) {
                    //     for(var key in data.query.pages){
                    //       if(data.query.pages.hasOwnProperty(key)){
                    //         console.log("This is the received data on abstract from wikipedia: ", data.query.pages[key].extract);
                    //         wikiabstract = data.query.pages[key].extract;
                    //       }
                    //     }
                    //   }
                    // });

                    var getdbpediaabstract = "select ?v ?abstract where { "
                      + "OPTIONAL { "
                      + "<"+iri.toIRIString(result.results.bindings[0].wikilink.value.replace("s","").replace(lang,"en")).replace("%20","_")+"> foaf:primaryTopic ?v . "
                      + " ?v dbo:abstract ?abstract . FILTER (lang(?abstract)=\""+lang+"\"). "
                      + " } "
                      + " }"

                    var getabstract = $.get("http://dbpedia.org/sparql?query=" + encodeURIComponent(getdbpediaabstract) + "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on")
                    getabstract.success(
                    function (data) {
                      wikiabstract = (data.results.bindings[0].abstract != null) ? data.results.bindings[0].abstract.value : "";
                      setinformation(binding,result,wikiabstract);
                    }
                  );
                }

                else {
                  setinformation(binding, result, "");
                }

                function setinformation(binding, result, wikiabstract){
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
                      type: QUESTION_ANSWERING_SUCCESS,
                      namedGraph: namedGraph,
                      SPARQLquery: query,
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
                      type: QUESTION_ANSWERING_SUCCESS,
                      namedGraph: namedGraph,
                      SPARQLquery: query,
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
                      type: QUESTION_ANSWERING_SUCCESS,
                      namedGraph: namedGraph,
                      SPARQLquery: query,
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


