/**
 * Created by Dennis on 18/05/17.
 */

import {wikidata_endpoint} from "../../../config"
import ResultSetKnowledgeBase from "../resultSetKnowledgeBase"

export default class ResultSetWikidata extends ResultSetKnowledgeBase{

  constructor(k,l){
    super(k,l);
    this.kb = "wikidata";
  }

  get(query,lang,callback){
      var SparqlParser = require('sparqljs').Parser;
      var parser = new SparqlParser();
      var parsedQuery = parser.parse(this.query);
      console.log(parsedQuery);
      if (parsedQuery.variables[0].hasOwnProperty("variable")){
        var variable = parsedQuery.variables[0].variable;
      } else {
        var variable = parsedQuery.variables[0];
      }
      variable = variable.substring(1,variable.length);
      //Retrive information about the uri from the endpoint
      var sparqlQuery = "PREFIX wdt: <http://www.wikidata.org/prop/direct/> " +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  " +
        "PREFIX schema: <http://schema.org/> " +
        "SELECT ?"+variable+" ?pageRank ?label ?image ?coordinates ?osmRelation ?wikilink ?youtube ?github ?twitter ?facebook ?instagram ?homepage ?orcid where { " +
        "{ SELECT ?"+variable+" where { " +
        "{ "+query+" }" +
        "}} "+
        "OPTIONAL { " +
        "  graph <http://wikidata.com/pageRank> { " +
        "    ?"+variable+" <http://purl.org/voc/vrank#pagerank> ?pageRank .  " +
        "}} "+
        "OPTIONAL{ " +
        //"<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" || lang(?label)=\"de\" || lang(?label)=\"fr\" || lang(?label)=\"it\")" +
        " ?"+variable+" rdfs:label ?label . FILTER (lang(?label)=?lang) . " +
        " values (?lang ?lang_) { (\""+lang+"\" 1) (\"en\" 2) (\"de\" 3) (\"fr\" 4) (\"it\" 5)} " + //Trick to find the labels if they do not exist in the desired language, otherwise the "Q number" appears which is ugly
        "} " +
        "OPTIONAL{ " +
        " ?"+variable+" wdt:P18 ?image . " +
        "} " +
        "OPTIONAL{ " +
        " ?"+variable+" wdt:P625 ?coordinates . " +
        "} " +
        "OPTIONAL{ " +
        " ?"+variable+" wdt:P402 ?osmRelation . " +
        "} " +
        "OPTIONAL{ " +
        " ?"+variable+" wdt:P1651 ?youtube . " +
        "} " +
        "OPTIONAL{ " +
        " ?"+variable+" wdt:P2037 ?github . " +
        "} " +
        "OPTIONAL{ " +
        " ?"+variable+" wdt:P2002 ?twitter . " +
        "} " +
        "OPTIONAL{ " +
        " ?"+variable+" wdt:P2013 ?facebook . " +
        "} " +
        "OPTIONAL{ " +
        " ?"+variable+" wdt:P2003 ?instagram . " +
        "} " +
        "OPTIONAL{ " +
        " ?"+variable+" wdt:P856 ?homepage . " +
        "} " +
        "OPTIONAL{ " +
        " ?"+variable+" wdt:P496 ?orcid . " +
        "} " +
        "OPTIONAL{ " +
        "?wikilink schema:about ?"+variable+" ; schema:inLanguage \""+ lang +"\" ; schema:isPartOf <https://"+lang+".wikipedia.org/> ." +
        "} " +
        "} limit 1000";
      console.log(sparqlQuery);
      var url = wikidata_endpoint +"?query=" + encodeURIComponent(sparqlQuery) + "&format=json";
      $.get(url).success(function (result) {
        console.log(result);
        var informationItem = Object.assign({}, this.informationItem);
        console.log("HERE KB "+this.kb);
        var previewsKey = result.results.bindings[0][variable].value;
        for (var i=0; i< result.results.bindings.length; i++) {
          console.log(i);
          informationItem.kb = this.kb;
          var actualKey = result.results.bindings[i][variable].value;
          if (!(actualKey == previewsKey)) {
            this.information.push(informationItem);
            informationItem = Object.assign({}, this.informationItem);
            previewsKey = actualKey;
          }
          var type = result.results.bindings[i][variable].type;
          var value = result.results.bindings[i][variable].value;
          if (type == "literal" || type == "typed-literal") {
            this.literal(result,i,variable,lang,informationItem)
          } else {
            informationItem.uri = actualKey;
            if (result.results.bindings[i].pageRank != undefined) {
              informationItem.pageRank = result.results.bindings[i].pageRank.value;
            } else {
              informationItem.pageRank = 0;
            }
            informationItem.links = {};
            informationItem.links.wikidata = actualKey;
            if (result.results.bindings[i].label != undefined) {
              if (informationItem.label == null) {
                informationItem.label = result.results.bindings[i].label.value;
              }
            }

            if (result.results.bindings[i].image != undefined) {
              informationItem.image = result.results.bindings[i].image.value + "?width=300";
            }

            if (result.results.bindings[i].coordinates != undefined) {
              var coordinates = result.results.bindings[i].coordinates.value.replace("Point(", "").replace(")", "").split(" ");
              informationItem.lat = parseFloat(coordinates[1])
              informationItem.long = parseFloat(coordinates[0]);
            }

            if (result.results.bindings[i].osmRelation != undefined) {
              informationItem.osmRelation = result.results.bindings[i].osmRelation.value;
            }

            if (result.results.bindings[i].youtube != undefined) {
              informationItem.youtube = result.results.bindings[i].youtube.value;
            }

            if (result.results.bindings[i].github != undefined) {
              informationItem.links.github = "https://github.com/" + result.results.bindings[i].github.value;
            }

            if (result.results.bindings[i].twitter != undefined) {
              informationItem.links.twitter = "https://twitter.com/" + result.results.bindings[i].twitter.value;
            }

            if (result.results.bindings[i].facebook != undefined) {
              informationItem.links.facebook = "https://www.facebook.com/" + result.results.bindings[i].facebook.value;
            }

            if (result.results.bindings[i].instagram != undefined) {
              informationItem.links.instagram = "https://www.instagram.com/" + result.results.bindings[i].instagram.value;
            }

            if (result.results.bindings[i].homepage != undefined) {
              informationItem.links.homepage = result.results.bindings[i].homepage.value;
            }

            if (result.results.bindings[i].orcid != undefined) {
              informationItem.links.orcid = "https://orcid.org/" + result.results.bindings[i].orcid.value;
            }

            if (result.results.bindings[i].wikilink != undefined) {
              //console.log(informationItem.links);
              informationItem.links.wikipedia = result.results.bindings[i].wikilink.value;
            }
          }
        }
        this.information.push(informationItem);
        this.information.sort(function(a, b){
          return b.pageRank - a.pageRank;
        });
        return callback();
      }.bind(this))
    }
}


