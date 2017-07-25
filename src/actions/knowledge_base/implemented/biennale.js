/**
 * Created by Dennis on 18/05/17.
 */

import {wikidata_endpoint} from "../../../config"
import ItemKnowledgeBase from "../knowledgeBase"
import iri from "iri";

export default class ItemCiteDuDesign extends ItemKnowledgeBase{

  constructor(k){
    super(k);
  }

  rank(){}

  get(result,lang,callback){
    this.information.kb = "biennale";
    var type = result.type;
    var value = result.value;
    console.log("RESULT",result);
    if (type=="typed-literal") {
      this.information.literal=value;
      return callback();
    } else if (type="uri"){
      //Retrive information about the uri from the endpoint
      var sparqlQuery = "SELECT ?label ?image ?description where { " +
        "OPTIONAL{ " +
        //"<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" || lang(?label)=\"de\" || lang(?label)=\"fr\" || lang(?label)=\"it\")" +
        "<" + value + "> rdfs:label ?label . FILTER (lang(?label)=?lang) . " +
        " values (?lang ?lang_) { (\""+lang+"\" 1) (\"en\" 2) (\"de\" 3) (\"fr\" 4) (\"it\" 5)} " + //Trick to find the labels if they do not exist in the desired language, otherwise the "Q number" appears which is ugly
        "} " +
        "OPTIONAL{ " +
        "<" + value + "> <https://wdaqua-biennale-design.univ-st-etienne.fr/prop/direct/P190> ?image . " +
        "} " +
        "OPTIONAL{ " +
        "<" + value + "> <https://wdaqua-biennale-design.univ-st-etienne.fr/prop/direct/P181> ?description . " +
        "} " +
        "} order by ?lang_ ";

      var url = citedudesign_endpoint +"?query=" + encodeURIComponent(sparqlQuery) + "&format=json";
      $.get(url).success(function (result) {
        console.log("HERE index "+this.k+" get", result);
        this.information.uri = value;
        this.information.links.citedudesign = value;

        if (result.results.bindings[0].label != undefined) {
          this.information.label = result.results.bindings[0].label.value;
        }

        if (result.results.bindings[0].image != undefined) {
          this.information.image = result.results.bindings[0].image.value + "?width=300";
        }
        if (result.results.bindings[0].description != undefined) {
          this.information.abstract = result.results.bindings[0].description.value;
        }
        else {
          return callback();
        }

      }.bind(this))
    }
  }
}


