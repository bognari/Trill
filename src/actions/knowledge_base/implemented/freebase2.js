/**
 * Created by Dennis on 18/05/17.
 */

import {freebase_endpoint} from "../../../config"
import ResultSetKnowledgeBase from "../resultSetKnowledgeBase"

export default class ResultSetFreebase extends ResultSetKnowledgeBase{

  constructor(k,l){
    super(k,l);
    this.kb = "freebase";
  }

  get(query,lang,callback){
      var SparqlParser = require('sparqljs').Parser;
      var parser = new SparqlParser();
      var parsedQuery = parser.parse(this.query);
      if (parsedQuery.variables[0].hasOwnProperty("variable")){
        var variable = parsedQuery.variables[0].variable;
      } else {
        var variable = parsedQuery.variables[0];
      }
      variable = variable.substring(1,variable.length);

      //Retrive information about the uri from the endpoint
      var sparqlQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/> "
        + "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> "
        + "PREFIX dbo: <http://dbpedia.org/ontology/> "
        + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  "
        + "SELECT ?"+variable+" ?pageRank ?label ?text ?image ?lat ?long where { "
        + "{ SELECT ?"+variable+" where { "
        + "{ "+query+" }"
        + "}} "
        + "OPTIONAL { "
        + "  graph <http://dbpedia.com/pageRank> { "
        + "    ?"+variable+" <http://purl.org/voc/vrank#pagerank> ?pageRank .  "
        + "}} "
        + " OPTIONAL{ "
        //"<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" || lang(?label)=\"de\" || lang(?label)=\"fr\" || lang(?label)=\"it\")" +
        + "  ?" + variable + " <http://www.w3.org/2000/01/rdf-schema#label> ?label . FILTER (lang(?label)=?lang) . "
        + "  values (?lang ?lang_) { (\""+lang+"\" 1) (\"en\" 2) (\"de\" 3) (\"fr\" 4) (\"it\" 5)} " //Trick to find the labels if they do not exist in the desired language, otherwise the "Q number" appears which is ugly
        + "} "
        + " OPTIONAL{ "
        + "  ?" + variable + " <http://rdf.freebase.com/ns/type.content_import.uri> ?image . "
        + "} "
        + " OPTIONAL{ "
        + "  ?" + variable + " <http://rdf.freebase.com/ns/location.location.geolocation..location.geocode.latitude> ?lat . "
        + " } "
        + " OPTIONAL{ "
        + "  ?" + variable + " <http://rdf.freebase.com/ns/location.location.geolocation..location.geocode.longitude> ?long . "
        + " } "
        + " OPTIONAL{ "
        + "  ?" + variable + " <http://rdf.freebase.com/ns/common.topic.description> ?text . FILTER (lang(?text)=\""+lang+"\") . "
        + " } "
        + "}" ;
      console.log(sparqlQuery);
      var url = freebase_endpoint +"?query=" + encodeURIComponent(sparqlQuery) + "&format=json";
      console.log(url);
      $.get(url).success(function (result) {
        console.log(result);
        var informationItem = Object.assign({}, this.informationItem);
        informationItem.kb = this.kb;
        var previewsKey = result.results.bindings[0][variable].value;
        for (var i=0; i< result.results.bindings.length; i++) {
          var actualKey = result.results.bindings[i][variable].value;
          if (!(actualKey == previewsKey)) {
            this.information.push(informationItem);
            informationItem = Object.assign({}, this.informationItem);
            previewsKey = actualKey;
          }
          var type = result.results.bindings[i][variable].type
          if (type == "literal" || type == "typed-literal") {
            informationItem = this.literal(result,i,variable);
          } else {
            informationItem.uri = actualKey;
            informationItem.kb = this.kb;
            //informationItem.pageRank = result.results.bindings[i].pageRank.value;
            informationItem.links = {};
            informationItem.links.freebase = actualKey;
            if (result.results.bindings[i].label != undefined) {
              if (informationItem.label == null) {
                informationItem.label = result.results.bindings[i].label.value;
              }
            }

            if (result.results.bindings[i].image != undefined) {
              informationItem.image = result.results.bindings[i].image.value + "?width=300";
            }

            if (result.results.bindings[0].long != undefined && result.results.bindings[0].long != undefined) {
              informationItem.lat = parseFloat(result.results.bindings[0].lat.value);
              informationItem.long = parseFloat(result.results.bindings[0].long.value);
            }

            if (result.results.bindings[i].wikilink != undefined) {
              informationItem.links.wikipedia = result.results.bindings[i].wikilink.value.replace("http://","https://");
            }

            if (result.results.bindings[0].text != undefined) {
              informationItem.abstract = result.results.bindings[0].text.value;
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


