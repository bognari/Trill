/**
 * Created by Dennis on 18/05/17.
 */

import {endpoint} from "../../../config"
import ItemKnowledgeBase from "../knowledgeBase"
import iri from "iri";

export default class ItemOpenStreetMap extends ItemKnowledgeBase{

  constructor(k){
    super(k);
  }

  get(result,lang,callback){
    this.information.kb = "openstreetmap";
    var type = result.type;
    var value = result.value;
    console.log("RESUTL",result);
    if (type=="literal") {
      this.information.literal = value;
      return callback();
    } else if (type=="typed-literal") {
      this.information.literal=value+" "+result.datatype;
      return callback();
    } else if (type="uri"){
      var sparqlQuery = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> "
        + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "
        + "select ?label ?abstract ?image ?lat ?long ?homepage where { "
        + " OPTIONAL{ "
        + "  <" + value + "> rdfs:label ?label . FILTER (lang(?label)=\"" + lang + "\" || lang(?label)=\"\")"
        + " } "
        + " OPTIONAL{ "
        + "  <" + value + "> geo:lat ?lat . "
        + " } "
        + " OPTIONAL{ "
        + "  <" + value + "> geo:long ?long . "
        + " } "
        + " OPTIONAL{ "
        + "  <" + value + "> <http://linkedgeodata.org/ontology/contact%3Awebsite> ?homepage . "
        + " } "
        + "} ";

      console.log(sparqlQuery);
      var url = endpoint + "openstreetmap/sparql?query=" + encodeURIComponent(sparqlQuery);
      $.get(url).success(function (result) {
        console.log("RESUTL",result);
        this.information.uri = value;
        this.information.links.openstreetmap = value;

        if (result.results.bindings[0].label != undefined) {
          this.information.label = result.results.bindings[0].label.value;
        }

        if (result.results.bindings[0].long != undefined && result.results.bindings[0].long != undefined) {
          this.information.lat = parseFloat(result.results.bindings[0].lat.value);
          this.information.long = parseFloat(result.results.bindings[0].long.value);
        }

        if (result.results.bindings[0].homepage != undefined) {
          this.information.links.homepage = result.results.bindings[0].homepage.value;
        }

        return callback();


      }.bind(this))
    }
  }
}


