/**
 * Created by Dennis on 18/05/17.
 */

import {endpoint} from "../../../config"
import ResultSetKnowledgeBase from "../resultSetKnowledgeBase";

export default class ResultSetOpenStreetMap extends ResultSetKnowledgeBase{

  constructor(k,l){
    super(k,l);
    this.kb = "openstreetmap";
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
    variable = variable.substring(1,variable.length)
    var sparqlQuery = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> "
      + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "
      + "select ?"+variable+" ?label ?abstract ?image ?lat ?long ?homepage where { "
      + "{ "+query+" }"
      + " OPTIONAL{ "
      + "  ?"+variable+" rdfs:label ?label . FILTER (lang(?label)=\"" + lang + "\" || lang(?label)=\"\")"
      + " } "
      + " OPTIONAL{ "
      + "  ?"+variable+" geo:lat ?lat . "
      + " } "
      + " OPTIONAL{ "
      + "  ?"+variable+" geo:long ?long . "
      + " } "
      + " OPTIONAL{ "
      + "  ?"+variable+" <http://linkedgeodata.org/ontology/contact%3Awebsite> ?homepage . "
      + " } "
      + "} ";
    console.log(sparqlQuery);
    var url = endpoint + "openstreetmap/sparql?query=" + encodeURIComponent(sparqlQuery);
    $.get(url).success(function (result) {
      for (var i=0; i< result.results.bindings.length; i++){
        var information = {kb: this.kb, uri: null, links: {}, label : null, lat: null, long: null};
        console.log(variable);
        console.log(result.results.bindings[i]);
        var type = result.results.bindings[i][variable].type;
        if (type == "literal" || type == "typed-literal") {
          console.log(information);
          information = this.literal(result,i,variable,lang,information);
          console.log(information);
        } else {
          information.kb = "openstreetmap";
          information.uri = "";
          information.links = {};
          information.links.openstreetmap = "";

          if (result.results.bindings[i].label != undefined) {
            information.label = result.results.bindings[i].label.value;
          }

          if (result.results.bindings[i].long != undefined && result.results.bindings[i].long != undefined) {
            information.lat = parseFloat(result.results.bindings[i].lat.value);
            information.long = parseFloat(result.results.bindings[i].long.value);
          }

          if (result.results.bindings[i].homepage != undefined) {
            information.links.homepage = result.results.bindings[i].homepage.value;
          }
        }
        this.information.push(information);
      }
      return callback();
    }.bind(this))
  }
}


