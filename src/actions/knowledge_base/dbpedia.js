/**
 * Created by Dennis on 18/05/17.
 */

import {dbpedia_endpoint} from "../../config"
import ItemKnowledgeBase from "./knowledgeBase"

export default class ItemDbpedia extends ItemKnowledgeBase{

  constructor(k){
    super(k);
  }

  rank(){
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

  get(result,lang,callback){
    var type = result.type;
    var value = result.value;
    if (type=="literal") {
      this.information.label=value;
      return callback();
    } else if (type="uri"){
      var sparqlQuery = "select ?label ?abstract ?image ?lat ?long ?wikilink where { "
        + " OPTIONAL{ "
        + "  <" + value + "> rdfs:label ?label . FILTER (lang(?label)=\"" + lang + "\")"
        + " } "
        + " OPTIONAL{ "
        + "  <" + value + "> dbo:thumbnail ?image . "
        + " } "
        + " OPTIONAL{ "
        + "  <" + value + "> dbo:abstract ?abstract . FILTER (lang(?abstract)=\"" + lang + "\") "
        + " } "
        + " OPTIONAL{ "
        + "  <" + value + "> geo:lat ?lat . "
        + " } "
        + " OPTIONAL{ "
        + "  <" + value + "> geo:long ?long . "
        + " } "
        + " OPTIONAL{ "
        + "  ?wikilink foaf:primaryTopic <" + value + "> . "
        + " } "
        + "} ";

      var dbpediaQueryUrl = dbpedia_endpoint + "?query=" + encodeURIComponent(sparqlQuery) + "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on";
      var getpropertiesrequest = $.get(dbpediaQueryUrl);
      getpropertiesrequest.success(function (result) {
        console.log("HERE get", result);
        this.information.uri = value;

        if (result.results.bindings[0].label != undefined) {
          this.label = result.results.bindings[0].label.value;
        } else {
          value.replace("http://dbpedia.org/resource/", "").replace("_", " ")
        }

        if (result.results.bindings[0].image != undefined) {
          this.information.image = result.results.bindings[0].image.value + "?width=300";
        }

        if (result.results.bindings[0].long != undefined && result.results.bindings[0].long != undefined) {
          this.information.lat = parseFloat(result.results.bindings[0].lat.value);
          this.information.long = parseFloat(result.results.bindings[0].long.value);
        }

        if (result.results.bindings[0].wikilink != undefined) {
          this.information.link_wikipedia = result.results.bindings[0].wikilink.value;
        }
        this.information.loaded = true;
        console.log("HERE get", result);
        return callback();
      }.bind(this))
    }
  }
}


