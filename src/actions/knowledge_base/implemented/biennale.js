/**
 * Created by Dennis on 18/05/17.
 */

import {biennale_endpoint} from "../../../config"
import ItemKnowledgeBase from "../knowledgeBase"
import iri from "iri";

export default class ItemBiennale extends ItemKnowledgeBase{

  constructor(k){
    super(k);
  }

  rank(){}

  get(result,lang,callback){
    this.information.kb = "biennale";
    var type = result.type;
    var value = result.value;
    console.log("RESULT",result);
    if (type=="typed-literal" || type=="literal") {
      if (result.datatype=="xsd:dateTime"){
        //2008-01-01T00:00:00Z
        this.information.literal=value.substring(0,4);
      } else {
        this.information.literal=value
      }
      return callback();
    } else if (type="uri"){
      if (value.endsWith(".jpg") || value.endsWith(".png")){
        this.information.image = value ;
        return callback();
      }
      //Retrive information about the uri from the endpoint
      var sparqlQuery = "SELECT ?label ?image ?description where { " +
        "OPTIONAL{ " +
        //"<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" || lang(?label)=\"de\" || lang(?label)=\"fr\" || lang(?label)=\"it\")" +
        "<" + value + "> <http://www.w3.org/2000/01/rdf-schema#label> ?label . FILTER (lang(?label)=?lang) . " +
        " values (?lang ?lang_) { (\""+lang+"\" 1) (\"en\" 2) (\"de\" 3) (\"fr\" 4) (\"it\" 5)} " + //Trick to find the labels if they do not exist in the desired language, otherwise the "Q number" appears which is ugly
        "} " +
        "OPTIONAL{ " +
        "<" + value + "> <https://wdaqua-biennale-design.univ-st-etienne.fr/prop/direct/P190> ?image . " +
        "} " +
        "OPTIONAL{ " +
        "<" + value + "> <https://wdaqua-biennale-design.univ-st-etienne.fr/prop/direct/P181> ?description . " +
        "} " +
        "} order by ?lang_ ";

      var url = biennale_endpoint +"?query=" + encodeURIComponent(sparqlQuery) + "&format=json";
      console.log(url);
      var req = $.get(url);
      req.success(function (result) {
        console.log("HERE index "+this.k+" get", result);
        this.information.uri = value;
        this.information.links.biennale = value.replace("https://wdaqua-biennale-design.univ-st-etienne.fr/entity/","https://wdaqua-biennale-design.univ-st-etienne.fr/wikibase/index.php/Item:"); //https://wdaqua-biennale-design.univ-st-etienne.fr/wikibase/index.php/Item:Q409

        if (result.results.bindings[0].label != undefined) {
          this.information.label = result.results.bindings[0].label.value;
        }

        if (result.results.bindings[0].image != undefined) {
          this.information.image = result.results.bindings[0].image.value ;
        }
        if (result.results.bindings[0].description != undefined) {
          this.information.abstract = result.results.bindings[0].description.value;
        }
        return callback();


      }.bind(this));
      req.error(function(data){
        this.error(data);
      }.bind(this))
    }
  }
}


