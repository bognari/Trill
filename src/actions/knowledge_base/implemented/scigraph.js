/**
 * Created by Dennis on 18/05/17.
 */

import {hdt_endpoint} from "../../../config"
import ItemKnowledgeBase from "../knowledgeBase"
import iri from "iri";

export default class ItemScigraph extends ItemKnowledgeBase{

  constructor(k){
    super(k);
  }

  rank(){}

  get(result,lang,callback){
    this.information.kb = "scigraph";
    var type = result.type;
    var value = result.value;
    console.log("RESUTL",result);
    if (type=="typed-literal" || type=="literal") {
      this.information.literal=value;
      return callback();
    } else if (type="uri"){
      //Retrive information about the uri from the endpoint
      var sparqlQuery = "PREFIX sg: <http://www.springernature.com/scigraph/ontologies/core/> "+
        "PREFIX owl: <http://www.w3.org/2002/07/owl#> " +
        "SELECT ?label ?abstract ?doi where { " +
        "  OPTIONAL{ " +
        //"<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" || lang(?label)=\"de\" || lang(?label)=\"fr\" || lang(?label)=\"it\")" +
        "    <" + value + "> sg:publishedName ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  sg:title ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  sg:doiLink ?doi . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  sg:abstract ?abstract . " +
        "  } " +
        "} ";
      console.log(sparqlQuery);
      var url = hdt_endpoint +"scigraph/sparql?query=" + encodeURIComponent(sparqlQuery) + "&format=json";
      $.get(url).success(function (result) {
        console.log("HERE index "+this.k+" get", result);
        this.information.uri = value;
        this.information.links.scigraph = value;

        if (result.results.bindings[0].label != undefined) {
          this.information.label = result.results.bindings[0].label.value;
        }

        if (result.results.bindings[0].abstract != undefined) {
          this.information.abstract = result.results.bindings[0].abstract.value;
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


