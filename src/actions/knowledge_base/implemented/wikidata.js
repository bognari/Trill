/**
 * Created by Dennis on 18/05/17.
 */

import {wikidata_endpoint} from "../../../config"
import ItemKnowledgeBase from "../knowledgeBase"
import iri from "iri";

export default class ItemWikidata extends ItemKnowledgeBase{

  constructor(k){
    super(k);
  }

  rank(){}

  get(result,lang,callback){
    this.information.kb = "wikidata";
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
      var sparqlQuery = "SELECT ?label ?image ?coordinates ?wikilink ?youtube ?github ?twitter ?facebook ?instagram where { " +
        "OPTIONAL{ " +
        //"<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" || lang(?label)=\"de\" || lang(?label)=\"fr\" || lang(?label)=\"it\")" +
        "<" + value + "> rdfs:label ?label . FILTER (lang(?label)=?lang) . " +
        " values (?lang ?lang_) { (\""+lang+"\" 1) (\"en\" 2) (\"de\" 3) (\"fr\" 4) (\"it\" 5)} " + //Trick to find the labels if they do not exist in the desired language, otherwise the "Q number" appears which is ugly
        "} " +
        "OPTIONAL{ " +
        "<" + value + "> wdt:P18 ?image . " +
        "} " +
        "OPTIONAL{ " +
        "<" + value + "> wdt:P625 ?coordinates . " +
        "} " +
        "OPTIONAL{ " +
        "<" + value + "> wdt:P1651 ?youtube . " +
        "} " +
        "OPTIONAL{ " +
        "<" + value + "> wdt:P2037 ?github . " +
        "} " +
        "OPTIONAL{ " +
        "<" + value + "> wdt:P2002 ?twitter . " +
        "} " +
        "OPTIONAL{ " +
        "<" + value + "> wdt:P2013 ?facebook . " +
        "} " +
        "OPTIONAL{ " +
        "<" + value + "> wdt:P2003 ?instagram . " +
        "} " +
        "OPTIONAL{ " +
        "?wikilink a schema:Article ; schema:about <" + value + "> ; schema:inLanguage \""+ lang +"\" ; schema:isPartOf <https://"+lang+".wikipedia.org/> ." +
        "} " +
        "} order by ?lang_ ";

      var url = wikidata_endpoint +"?query=" + encodeURIComponent(sparqlQuery) + "&format=json";
      $.get(url).success(function (result) {
        console.log("HERE index "+this.k+" get", result);
        this.information.uri = value;
        this.information.links.wikidata = value;

        if (result.results.bindings[0].label != undefined) {
          this.information.label = result.results.bindings[0].label.value;
        }

        if (result.results.bindings[0].image != undefined) {
          this.information.image = result.results.bindings[0].image.value + "?width=300";
        }

        if (result.results.bindings[0].coordinates != undefined) {
          var coordinates = result.results.bindings[0].coordinates.value.replace("Point(", "").replace(")", "").split(" ");
          this.information.lat = parseFloat(coordinates[1])
          this.information.long = parseFloat(coordinates[0]);
        }

        if (result.results.bindings[0].youtube != undefined) {
          this.information.youtube = result.results.bindings[0].youtube.value;
        }

        if (result.results.bindings[0].github != undefined) {
          this.information.links.github = "https://github.com/"+result.results.bindings[0].github.value;
        }

        if (result.results.bindings[0].twitter != undefined) {
          this.information.links.twitter = "https://twitter.com/"+result.results.bindings[0].twitter.value;
        }

        if (result.results.bindings[0].facebook != undefined) {
          this.information.links.facebook = "https://www.facebook.com/"+result.results.bindings[0].facebook.value;
        }

        if (result.results.bindings[0].instagram != undefined) {
          this.information.links.instagram = "https://www.instagram.com/"+result.results.bindings[0].instagram.value;
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
    }
  }
}


