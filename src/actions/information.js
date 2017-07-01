/**
 * Created by Dennis on 20/06/17.
 */

if (jresult.hasOwnProperty("boolean")) {
  var information = [];
  information.push({
    label: (jresult.boolean == true) ? "True" : "False",
    answertype: "simple",
  })
  dispatch({
    type: QANARY_SUCCESS,
    namedGraph: namedGraph,
    SPARQLquery: query,
    json: jresult,
    information: information,
    loaded: true,
  });
} else {
  var variable=jresult.head.vars[0];

  //check whether if the results are wikidata and then whether or not to rank the answers
  if(knowledgebase == "wikidata"){
    console.log('This is the json result (not ranked due to wikidata result): ', jresult);
    dispatch(configureResult(query, jresult, lang, namedGraph));
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
      dbpedia_endpoint+"?query="+encodeURIComponent(rankedSparql)+"&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on",
      function (rankedresult) {

        console.log('This is the json result (ranked): ', rankedresult);
        dispatch(configureResult(query, rankedresult, lang, namedGraph));

      }.bind(this));
  }
}


/**
 * Created by Dennis on 24/01/17.
 */

import {dbpedia_endpoint} from "./queryBackend"
import iri from "iri";

export function retriveInformation(binding, lang, fnReturn) {
  var type = binding.type;
  var value = binding.value;
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
      " values (?lang ?lang_) { (\"" + lang + "\" 1) (\"en\" 2) (\"de\" 3) (\"fr\" 4) (\"it\" 5)} " + //Trick to find the labels if they do not exist in the desired language, otherwise the "Q number" appears which is ugly
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
      "?wikilink a schema:Article ; schema:about <" + value + "> ; schema:inLanguage \"" + lang + "\" ; schema:isPartOf <https://" + lang + ".wikipedia.org/> ." +
      "} " +
      "} order by ?lang_ ";

    var dbpediaQueryUrl = dbpedia_endpoint + "?query=" + encodeURIComponent(sparqlQuery) + "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on";
    var wikiQueryUrl = "https://query.wikidata.org/sparql?query=" + encodeURIComponent(wikiSparqlQuery) + "&format=json";


    var getpropertiesrequest = $.get((value.indexOf("wikidata") > -1) ? wikiQueryUrl : dbpediaQueryUrl);

    getpropertiesrequest.success(function (result) {

      //Shrink the image size
      console.log("IMAGE", result.results.bindings[0].image)
      if (result.results.bindings[0].image != undefined) {
        result.results.bindings[0].image.value += "?width=300";
      }
      console.log("IMAGE2", result.results.bindings[0].image)

      //in the case of wikidata the abstract needs to be retrieved from wikipedia and the image needs to be shrinked
      var wikiabstract = "";
      if (value.indexOf("wikidata") > -1 && result.results.bindings[0].wikilink != null) {

        $.ajax({
          url: "https://" + lang + ".wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&origin=*&explaintext=&titles=" + iri.toIRIString(result.results.bindings[0].wikilink.value.replace("https://" + lang + ".wikipedia.org/wiki/", "")).replace("%20", "_"),
          async: false,
          type: "GET",
          contentType: false,
          success: function (data) {
            console.log("THIS", this);
            for (var key in data.query.pages) {
              if (data.query.pages.hasOwnProperty(key)) {
                wikiabstract = data.query.pages[key].extract;
                if (wikiabstract != undefined) {
                  return setinformation(binding, result, wikiabstract, fnReturn);
                } else {
                  return setinformation(binding, result, "", fnReturn);
                }
              }
            }
          }.bind(this)
        });
      }
      else {
        return setinformation(this.props.binding, result, "", fnReturn);
      }
    }.bind(this))
  }
  else if (type == "typed-literal" || type == "literal") {
    var information = ({
      label: binding[variable].value,
      answertype: "simple",
    });
    fnReturn(information);
  }
}

function setinformation(binding, result, wikiabstract, fnReturn){
  var value = binding.value;
  console.log("THIS",this);
  //to refactor the following if statements to one switch statement? I.e. do a checks on the result to
  //determine and set answertype
  if (Object.keys(result.results.bindings[0]).length == 0) { //Case when there is no information, only the URI is available
    var information = ({
      label: value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
      answertype: "noinfo",
      uri: value,
    });
    fnReturn(information);
  }
  else if (result.results.bindings[0].lat != undefined) { //case there are geo coordinates

    if(result.results.bindings[0].long ==  undefined) {
      var coordinates = result.results.bindings[0].lat.value.replace("Point(", "").replace(")", "").split(" ");
    }

    var information = ({
      label: (result.results.bindings[0].label != undefined) ? result.results.bindings[0].label.value : value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
      abstract: (result.results.bindings[0].abstract != undefined) ? result.results.bindings[0].abstract.value : (wikiabstract != "") ? wikiabstract : "",
      image: (result.results.bindings[0].image != undefined) ? result.results.bindings[0].image.value : "",
      answertype: "map",
      uri: value,
      link: (result.results.bindings[0].wikilink != undefined) ? result.results.bindings[0].wikilink.value : null,
      //key: k,
      lat: (result.results.bindings[0].long ==  undefined) ? parseFloat(coordinates[1]) : parseFloat(result.results.bindings[0].lat.value),
      long: (result.results.bindings[0].long ==  undefined) ? parseFloat(coordinates[0]) : parseFloat(result.results.bindings[0].long.value),
      loaded: true,
    });
    fnReturn(information);
  }

  else {//case of regular detailed answer

    var information = ({
      label: (result.results.bindings[0].label != undefined) ? result.results.bindings[0].label.value : value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
      abstract: (result.results.bindings[0].abstract != undefined) ? result.results.bindings[0].abstract.value : (wikiabstract != "") ? wikiabstract : "",
      image: (result.results.bindings[0].image != undefined) ? result.results.bindings[0].image.value : "",
      answertype: "detail",
      uri: value,
      link: (result.results.bindings[0].wikilink != undefined) ? result.results.bindings[0].wikilink.value : null,
      //key: k,
      loaded: true,
    });
    fnReturn(information);
  }
}
