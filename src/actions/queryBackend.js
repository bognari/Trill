/**
 * Created by Dennis on 11/11/16.
 */

export const QUESTION_ANSWERING_REQUEST = 'START_QUESTION_ANSWERING';
export const QUESTION_ANSWERING_SUCCESS = 'QUESTION_ANSWERING_SUCCESS'
export const QUESTION_ANSWERING_FAILURE = 'QUESTION_ANSWERING_FAILURE'

export function startQuestionAnsweringWithTextQuestion(question){
  return function (dispatch) {
    dispatch({type: QUESTION_ANSWERING_REQUEST, question: question});
    var questionresult = $.post("http://wdaqua-qanary.univ-st-etienne.fr/startquestionansweringwithtextquestion", "question=" + encodeURIComponent(question) + "&componentlist[]=wdaqua-core0, QueryExecuter", function (data) {
      sendQueryToEndpoint(data, dispatch, question);
    });

    questionresult.fail(function (e) {
      console.log(e.statusCode + " " + e.statusText);

      var information = this.state.information;
      information.push({
        message: e.statusCode + " " + e.statusText,
      });

      dispatch({type: QUESTION_ANSWERING_FAILURE, error: true, information: information, loaded: true});

    })
  }
}

function sendQueryToEndpoint(data, dispatch, question){
  var namedGraph = data.graph.toString();
  var sparqlQuery =  "PREFIX qa: <http://www.wdaqua.eu/qa#> "
    + "PREFIX oa: <http://www.w3.org/ns/openannotation/core/> "
    + "SELECT ?sparql ?json ?score "
    + "FROM <"+  namedGraph + "> "
    + "WHERE { "
    + "  ?a a qa:AnnotationOfAnswerSPARQL . "
    + "  OPTIONAL {?a oa:hasBody ?sparql . } "
    + "  ?a qa:hasScore ?score . "
    + "?a oa:AnnotatedAt ?time "
    + "{ "
    + " select ?time { "
    + " ?a a qa:AnnotationOfAnswerSPARQL . "
    + " ?a oa:AnnotatedAt ?time "
    + " } order by DESC(?time) limit 1 "
    + " } "
    + "  ?b a qa:AnnotationOfAnswerJSON . "
    + "  ?b oa:hasBody ?json . "
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
      var query = result.results.bindings[0].sparql.value;
      var jresult = JSON.parse(result.results.bindings[0].json.value);
      //---ranking--- is 2 requests necessary?

      var variable=jresult.head.vars[0];

      var rankedSparql = "PREFIX vrank:<http://purl.org/voc/vrank#>" +
        "SELECT ?"+ variable + " " +
        "FROM <http://dbpedia.org>" +
        "FROM <http://people.aifb.kit.edu/ath/#DBpedia_PageRank>" +
        "WHERE {" +
        "{"+ query +"} " +
        "OPTIONAL { ?" + variable+ " vrank:hasRank/vrank:rankValue ?v. } " +
        "}" +
        "ORDER BY DESC(?v) LIMIT 1000";

      console.log("ranked sparql query: ", rankedSparql);

      var rankedrequest = $.get(
        "http://dbpedia.org/sparql?query="+encodeURIComponent(rankedSparql)+"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on",
        function (rankedresult) {

          console.log("This is the unranked result: ", result);
          console.log("This is the ranked result: ", rankedresult);
          //var jrankedresult = JSON.parse(rankedresult.results.bindings[0].json.value);

          configureResult(query, rankedresult, dispatch, question, namedGraph);

        }.bind(this));

      //---------------------

    }
  });
}

function configureResult(query, jresult, dispatch, question, namedGraph){

  var count = 0;
  console.log('This is the json result: ', jresult);

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
      question: question,
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
                    loaded: true,
                    answertype: "noinfo",
                    link: value,
                    key: k,
                  })
                  dispatch({
                    type: QUESTION_ANSWERING_SUCCESS,
                    namedGraph: namedGraph,
                    question: question,
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
                    loaded: true,
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
                    question: question,
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
                    loaded: true,
                    answertype: "detail",
                    uri: value,
                    link: (result.results.bindings[0].wikilink != undefined) ? result.results.bindings[0].wikilink.value : value,
                    key: k,
                  })
                  dispatch({
                    type: QUESTION_ANSWERING_SUCCESS,
                    namedGraph: namedGraph,
                    question: question,
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
              loaded: true,
              answertype: "simple",
              key: k,
            })
            dispatch({
              type: QUESTION_ANSWERING_SUCCESS,
              namedGraph: namedGraph,
              question: question,
              SPARQLquery: query,
              information: information,
              loaded: true,
            });
          }
        }
      })
    }
    else { //if there are no results
      dispatch({
        type: QUESTION_ANSWERING_SUCCESS,
        namedGraph: namedGraph,
        question: question,
        SPARQLquery: query,
        label: "No results",
        loaded: true,
        answertype: "simple"
      });
    }
  }
}
