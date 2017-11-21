/**
 * Created by Dennis on 18/05/17.
 */

import {dblp_endpoint} from "../../../config"
import ItemKnowledgeBase from "../knowledgeBase"
import iri from "iri";

export default class ItemDblpItem extends ItemKnowledgeBase{

  constructor(k){
    super(k);
  }

  rank(){}

  get(result,lang,callback){
    this.information.kb = "dblp";
    var type = result.type;
    var value = result.value;
    console.log("RESUTL",result);
    if (type=="typed-literal" || type=="literal") {
      this.information.literal=value;
      return callback();
    } else if (type="uri"){
      //Retrive information about the uri from the endpoint
      var sparqlQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/> "+
        "PREFIX owl: <http://www.w3.org/2002/07/owl#> " +
        "SELECT ?label ?doi where { " +
        "  OPTIONAL{ " +
        "    <" + value + ">  <http://www.w3.org/2000/01/rdf-schema#label> ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  foaf:homepage ?doi . " +
        "    FILTER ( regex(str(?doi), \"https://doi.org/\" )) " +
        "  } " +
        "} ";
      var url = dblp_endpoint +"?query=" + encodeURIComponent(sparqlQuery) + "&format=json";
      $.get(url).success(function (result) {
        console.log("HERE index "+this.k+" get", result);
        this.information.uri = value;
        this.information.links.dblp = value;

        if (result.results.bindings[0].label != undefined) {
          this.information.label = result.results.bindings[0].label.value;
        }

        if (result.results.bindings[0].doi != undefined) {
          var doi = result.results.bindings[0].doi.value;
          this.information.links.doi = doi;
        }
        return callback();
      }.bind(this))
    }
  }
}


