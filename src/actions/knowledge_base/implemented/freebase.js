/**
 * Created by Dennis on 18/05/17.
 */

import {freebase_endpoint} from "../../../config"
import ItemKnowledgeBase from "../knowledgeBase"
import iri from "iri";

export default class ItemFreebase extends ItemKnowledgeBase{

  constructor(k){
    super(k);
  }

  rank(){}

  get(result,lang,callback){
    this.information.kb = "freebase";
    var type = result.type;
    var value = result.value;
    console.log("RESUTL",result);
    if (type=="literal") {
      this.information.literal=value;
      return callback();
    } else if (type=="typed-literal"){
      if (result.datatype=="http://www.w3.org/2001/XMLSchema#decimal") {
        this.information.literal = parseFloat(value).toLocaleString("DE-de");
        return callback();
      } else if (result.datatype=="http://www.w3.org/2001/XMLSchema#dateTime"){
          //2008-01-01T00:00:00Z
          this.information.literal=value.substring(0,10);
          return callback();
      } else {
        this.information.literal=value;
        return callback();
      }
    } else if (type=="uri"){
      //Retrive information about the uri from the endpoint
      var sparqlQuery = "SELECT ?label ?image ?lat ?long ?wikilink ?text where { " +
        " OPTIONAL{ " +
        //"<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" || lang(?label)=\"de\" || lang(?label)=\"fr\" || lang(?label)=\"it\")" +
        "<" + value + "> <http://www.w3.org/2000/01/rdf-schema#label> ?label . FILTER (lang(?label)=?lang) . " +
        " values (?lang ?lang_) { (\""+lang+"\" 1) (\"en\" 2) (\"de\" 3) (\"fr\" 4) (\"it\" 5)} " + //Trick to find the labels if they do not exist in the desired language, otherwise the "Q number" appears which is ugly
        "} " +
        " OPTIONAL{ " +
        "<" + value + "> <http://rdf.freebase.com/ns/type.content_import.uri> ?image . " +
        "} " +
        " OPTIONAL{ " +
        "  <" + value + "> <http://rdf.freebase.com/ns/location.location.geolocation..location.geocode.latitude> ?lat . " +
        " } " +
        " OPTIONAL{ " +
        "  <" + value + "> <http://rdf.freebase.com/ns/location.location.geolocation..location.geocode.longitude> ?long . " +
        " } " +
        " OPTIONAL{ " +
        "  <" + value + "> <http://rdf.freebase.com/ns/common.topic.description> ?text . FILTER (lang(?text)=\""+lang+"\") . " +
        " } " +
        "} order by ?lang_ ";
      var url = freebase_endpoint +"?query=" + encodeURIComponent(sparqlQuery) + "&format=json";
      var request=$.get(url);
      request.success(function (result) {
        console.log("HERE index "+this.k+" get", result);
        this.information.uri = value;
        this.information.links.freebase = value;

        if (result.results.bindings[0].label != undefined) {
          this.information.label = result.results.bindings[0].label.value;
        }

        if (result.results.bindings[0].image != undefined) {
          this.information.image = result.results.bindings[0].image.value + "?width=300";
        }

        if (result.results.bindings[0].long != undefined && result.results.bindings[0].long != undefined) {
          this.information.lat = parseFloat(result.results.bindings[0].lat.value);
          this.information.long = parseFloat(result.results.bindings[0].long.value);
        }

        if (result.results.bindings[0].text != undefined) {
          this.information.abstract = result.results.bindings[0].text.value;
        }

        if (result.results.bindings[0].wikilink != undefined) {
          this.information.links.wikipedia = result.results.bindings[0].wikilink.value;

          //Retrive the abstract from wikipedia
          url = "https://"+lang+".wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&origin=*&explaintext=&titles=" + iri.toIRIString(result.results.bindings[0].wikilink.value.replace("https://"+lang+".wikipedia.org/wiki/","")).replace("%20","_");
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
      request.error(function(error){
        console.log("ERROR", error);
      })
    }
  }
}


