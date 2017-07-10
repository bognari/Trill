/**
 * Created by Dennis on 18/05/17.
 */

import {dbpedia_endpoint} from "../../../config"
import ItemKnowledgeBase from "../knowledgeBase"
import iri from "iri";

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
    this.information.kb = "dbpedia";
    var type = result.type;
    var value = result.value;
    if (type=="literal") {
      this.information.literal = value;
      return callback();
    } else if (type=="typed-literal") {
      this.information.literal=value+" "+result.datatype;
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

      var url = dbpedia_endpoint + "?query=" + encodeURIComponent(sparqlQuery) + "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on";
      $.get(url).success(function (result) {
        this.information.uri = value;

        if (result.results.bindings[0].label != undefined) {
          this.information.label = result.results.bindings[0].label.value;
        } else {
          this.information.label = value.replace("http://dbpedia.org/resource/", "").replace("_", " ")
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


          console.log(result.results.bindings[0].wikilink.value);
          //Retrive the abstract from wikipedia
          url = "https://"+lang+".wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&origin=*&explaintext=&titles=" + iri.toIRIString(result.results.bindings[0].wikilink.value.replace("http://"+lang+".wikipedia.org/wiki/","")).replace("%20","_");
          $.get(url).success(function (data) {
            for(var key in data.query.pages){
              if(data.query.pages.hasOwnProperty(key)){
                if (data.query.pages[key].extract !=undefined){
                  this.information.abstract = data.query.pages[key].extract ;
                  return callback();
                }
              }
            }
          }.bind(this))
        } else {
          return callback();
        }

      }.bind(this))
    }
  }
}


