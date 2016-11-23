/**
 * Created by Dennis on 11/11/16.
 */

export const QUESTION_ANSWERING_REQUEST = 'QUESTION_ANSWERING_REQUEST';
export const QUESTION_ANSWERING_SUCCESS = 'QUESTION_ANSWERING_SUCCESS'
export const QUESTION_ANSWERING_FAILURE = 'QUESTION_ANSWERING_FAILURE'

export function startQuestionAnsweringWithTextQuestion(question){
  return function (dispatch) {
    dispatch({type: QUESTION_ANSWERING_REQUEST, question: question});
    var questionresult = $.post("http://wdaqua-qanary.univ-st-etienne.fr/startquestionansweringwithtextquestion", "question=" + encodeURIComponent(question) + "&componentlist[]=wdaqua-core0, QueryExecuter", function (data) {
      sendQueryToEndpoint(data, dispatch);
      //Here we receive the namedGraph (data.graph)
    });

    questionresult.fail(function (e) {
      // var information = this.state.information;
      // information.push({
      //   message: e.statusCode + " " + e.statusText,
      // });
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
      url: "http://wdaqua-qanary.univ-st-etienne.fr/startquestionansweringwithaudioquestion",
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
    dispatch({type: QUESTION_ANSWERING_REQUEST});

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
      url: "http://wdaqua-qanary.univ-st-etienne.fr/questionanswering",
      type: "POST",
      data: form,
      processData: false,
      contentType: false,
      success: function (data) {
        retriveQuestion(data);
        //retriveQuestion(data, dispatch);
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
    url: "http://wdaqua-endpoint.univ-st-etienne.fr/qanary/query?query=" + encodeURIComponent(sparqlQuery),
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
      uriText=uriText.replace("http://qanaryhost:8080/question/","http://wdaqua-qanary.univ-st-etienne.fr/question/")+"/raw";
      //Dereference the uri and retrieve the text
      $.ajax({
          url: uriText,
          type: "GET",
        success: function(result) {
            console.log(result);
            dispatch({type: 'SET_QUESTION', question: result});
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
    url: "http://wdaqua-endpoint.univ-st-etienne.fr/qanary/query?query=" + encodeURIComponent(sparqlQuery),
    type: "GET",
    beforeSend: function(xhr){
      xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:admin"));
      xhr.setRequestHeader('Accept', 'application/sparql-results+json');
    },
    success: function(result) {
      var query = [];
      for(var i=0; i<result.results.bindings.length; i++) {
        query[i] = {query:result.results.bindings[i].sparql.value , score: parseInt(result.results.bindings[i].score.value)};
        //Here we receive the question converted to a query (first one in an array of ranked possible queries)
      }
      console.log("QUERY");
      console.log(query);
      var jresult = JSON.parse(result.results.bindings[0].json.value);
      //---ranking--- is 2 requests necessary?

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

      var rankedrequest = $.get(
        "http://dbpedia.org/sparql?query="+encodeURIComponent(rankedSparql)+"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on",
        function (rankedresult) {

          configureResult(query, rankedresult, dispatch, namedGraph);

        }.bind(this));

      //---------------------

    }
  });
}

function configureResult(query, jresult, dispatch, namedGraph){

  var count = 0;
  console.log('This is the json result (ranked): ', jresult);

  //check if it is an ask query
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
  else {
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
              + "<" + value + "> rdfs:label ?label . "
              + "} "
              + " OPTIONAL{ "
              + "<" + value + "> dbo:thumbnail ?image . "
              + "} "
              + " OPTIONAL{ "
              + "<" + value + "> dbo:abstract ?abstract . "
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
              + " FILTER (lang(?label)=\"en\" && lang(?abstract)=\"en\") "
              + " } ";

            $.get(
              "http://dbpedia.org/sparql?query=" + encodeURIComponent(sparqlQuery) + "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on",
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
                  console.log("Abstract: " + result.results.bindings[0].abstract.value);

                  information.push({
                    label: (result.results.bindings[0].label != undefined) ? result.results.bindings[0].label.value : value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
                    abstract: result.results.bindings[0].abstract.value,
                    image: (result.results.bindings[0].image != undefined) ? result.results.bindings[0].image.value : "",
                    answertype: "map",
                    uri: value,
                    link: (result.results.bindings[0].wikilink != undefined) ? result.results.bindings[0].wikilink.value : value,
                    key: k,
                    lat: result.results.bindings[0].lat.value,
                    long: result.results.bindings[0].long.value,
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
                  console.log("Abstract: " + result.results.bindings[0].abstract.value);

                  information.push({
                    label: (result.results.bindings[0].label != undefined) ? result.results.bindings[0].label.value : value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
                    abstract: result.results.bindings[0].abstract.value,
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
  }
}
