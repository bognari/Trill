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
        // if (result.results.bindings[0].wikilink != undefined) {
        //   this.information.links.wikipedia = result.results.bindings[0].wikilink.value;
        //
        //   //Retrieve the abstract from wikipedia
        //   url = "https://"+lang+".wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&origin=*&explaintext=&titles=" + iri.toIRIString(result.results.bindings[0].wikilink.value.replace("http://","").replace("https://","").replace(lang+".wikipedia.org/wiki/","")).replace("%20","_");
        //   var req =$.get(url)
        //     req.success(function (data) {
        //     for(var key in data.query.pages){
        //       if(data.query.pages.hasOwnProperty(key)){
        //         if (data.query.pages[key].extract !=undefined){
        //           this.information.abstract = data.query.pages[key].extract ;
        //
        //
        //           //Retrive the image from wikipedia
        //           url = "https://"+lang+".wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&origin=*&pithumbsize=500&titles="+ iri.toIRIString(result.results.bindings[0].wikilink.value.replace("https://"+lang+".wikipedia.org/wiki/","")).replace("%20","_");
        //           req = $.get(url);
        //           req.success(function (data) {
        //             console.log(data);
        //             for (var key in data.query.pages) {
        //               if (data.query.pages.hasOwnProperty(key)) {
        //                 console.log(data.query.pages[key]);
        //                 if (data.query.pages[key].thumbnail != undefined) {
        //                   console.log(data.query.pages[key].thumbnail.source);
        //                   this.information.image = data.query.pages[key].thumbnail.source;
        //                   return callback();
        //                 }
        //               }
        //             }
        //             return callback();
        //           }.bind(this))
        //           req.error(function(data){
        //             this.error(data);
        //           }.bind(this))
        //
        //
        //         }
        //       }
        //     }
        //   }.bind(this));
        //   req.error(function(data){
        //     this.error(data);
        //   })
        // } else {
        //   return callback();
        // }

      }.bind(this))
    }
  }
}


