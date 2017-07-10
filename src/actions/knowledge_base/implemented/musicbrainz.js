/**
 * Created by Dennis on 18/05/17.
 */

import {musicbrainz_endpoint} from "../../../config"
import ItemKnowledgeBase from "../knowledgeBase"
import iri from "iri";

export default class ItemMusicBrainz extends ItemKnowledgeBase{

  constructor(k){
    super(k);
  }

  rank(){}

  get(result,lang,callback){
    this.information.kb = "musicbrainz";
    var type = result.type;
    var value = result.value;
    console.log("RESUTL",result);
    if (type=="typed-literal") {
      this.information.literal=value;
      return callback();
    } else if (type="uri"){
      //Retrive information about the uri from the endpoint
      var sparqlQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/> "+
        "SELECT ?label ?image ?coordinates ?wikilink where { " +
        "  OPTIONAL{ " +
        //"<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" || lang(?label)=\"de\" || lang(?label)=\"fr\" || lang(?label)=\"it\")" +
        "    <" + value + "> foaf:name ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  <http://purl.org/dc/elements/1.1/title> ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  <http://www.w3.org/2000/01/rdf-schema#label> ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  foaf:isPrimaryTopicOf ?wikilink . " +
        "  } " +
        "} ";

      var url = musicbrainz_endpoint +"?query=" + encodeURIComponent(sparqlQuery) + "&format=json";
      $.get(url).success(function (result) {
        console.log("HERE index "+this.k+" get", result);
        this.information.uri = value;

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

        if (result.results.bindings[0].wikilink != undefined) {
          this.information.link_wikipedia = result.results.bindings[0].wikilink.value;

          //Retrive the abstract from wikipedia
          url = "https://"+lang+".wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&origin=*&explaintext=&titles=" + iri.toIRIString(result.results.bindings[0].wikilink.value.replace("https://"+lang+".wikipedia.org/wiki/","")).replace("%20","_");
          $.get(url).success(function (data) {
            console.log("BLU");
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


