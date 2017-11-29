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
      var sparqlQuery = "PREFIX sg: <http://scigraph.springernature.com/ontologies/core/> "+
        "PREFIX owl: <http://www.w3.org/2002/07/owl#> " +
        "SELECT ?label ?doi ?homepage ?issn ?wikilink ?lat ?long where { " +
        "  OPTIONAL{ " +
        //"<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" || lang(?label)=\"de\" || lang(?label)=\"fr\" || lang(?label)=\"it\")" +
        "    <" + value + "> sg:publishedName ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  sg:title ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  <http://www.w3.org/2000/01/rdf-schema#label> ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  <http://www.w3.org/2004/02/skos/core#prefLabel> ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  sg:doiLink ?doi . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  sg:doi ?doi . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  sg:webpage ?homepage . " +
        "  } " +
        "  OPTIONAL{ " +
        "    ?s ?p <"+value+"> . " +
        "    ?s <http://scigraph.springernature.com/ontologies/core/issn> ?issn " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  <http://www.grid.ac/ontology/wikipediaPage> ?wikilink . " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  <http://www.grid.ac/ontology/hasAddress> ?o . " +
        "    ?o <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat " +
        "  } " +
        "  OPTIONAL{ " +
        "    <" + value + ">  <http://www.grid.ac/ontology/hasAddress> ?o . " +
        "    ?o <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?long " +
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

        if (result.results.bindings[0].long != undefined && result.results.bindings[0].lat != undefined) {
          console.log("LATTTTTT "+parseFloat(result.results.bindings[0].lat.value));
          this.information.lat = parseFloat(result.results.bindings[0].lat.value);
          this.information.long = parseFloat(result.results.bindings[0].long.value);
        }

        if (result.results.bindings[0].homepage != undefined) {
          this.information.links.homepage = result.results.bindings[0].homepage.value;
          if (result.results.bindings[0].homepage.value.includes("http://link.springer.com/journal/")){
            this.information.image = "http://static-content.springer.com/cover/journal/"+result.results.bindings[0].homepage.value.replace("http://link.springer.com/journal/","")+".jpg";
          }
        }

        http://static-content.springer.com/cover/journal/10115.jpg

          if (result.results.bindings[0].issn != undefined) {
            var issn = result.results.bindings[0].issn.value;

            this.information.abstract = "Imagine here a nice description of this journal ; )" ;
            //Retrive the abstract from springer api
            // url = "http://api.springer.com/metadata/json/issn/"+issn+"?api_key=93f11aed022b47339ab260ea464512f6";
            // console.log("URLLLLL"+url);
            // var request = $.getJSON(url);
            // request.success(function (data) {
            //   console.log(data);
            //   console.log(data.query);
            //   console.log(data.records);
            //   this.information.abstract = data.records[0].abstract ;
            //   return callback();
            // }.bind(this))
            // request.error(function (data) {
            //   console.log(data);
            //   return callback();
            // })
          }


        if (result.results.bindings[0].doi != undefined) {
          var doi = result.results.bindings[0].doi.value;
          this.information.links.doi = doi;

          //Retrive the abstract from springer api
          url = "http://api.springer.com/metadata/json/doi/"+doi.replace("http://dx.doi.org/","")+"?api_key=93f11aed022b47339ab260ea464512f6";
          console.log("URLLLLL"+url);
          var request = $.getJSON(url);
          request.success(function (data) {
            console.log(data);
            console.log(data.query);
            console.log(data.records);
                  this.information.abstract = data.records[0].abstract ;
                  return callback();
          }.bind(this))
          request.error(function (data) {
            console.log(data);
            if (result.results.bindings[0].wikilink == undefined){
              return callback();
            }
          })
        }


        if (result.results.bindings[0].wikilink != undefined) {
          this.information.links.wikipedia = result.results.bindings[0].wikilink.value;

          //Retrive the abstract from wikipedia
          url = "https://"+lang+".wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&origin=*&explaintext=&titles=" + iri.toIRIString(result.results.bindings[0].wikilink.value.replace("http://","").replace("https://","").replace(lang+".wikipedia.org/wiki/","")).replace("%20","_");
          console.log("URLLL "+url);
          $.get(url).success(function (data) {
            console.log(data);
            for(var key in data.query.pages){
              if(data.query.pages.hasOwnProperty(key)){
                if (data.query.pages[key].extract !=undefined){
                  this.information.abstract = data.query.pages[key].extract ;
                  return callback();
                }
              }
            }
          }.bind(this))
        }


        if (result.results.bindings[0].doi != undefined && result.results.bindings[0].wikilink != undefined) {
          return callback();
        }

        if (result.results.bindings[0].doi  == undefined && result.results.bindings[0].wikilink == undefined) {
          return callback();
        }


        //to get the abstract curl

      }.bind(this))
    }
  }
}


