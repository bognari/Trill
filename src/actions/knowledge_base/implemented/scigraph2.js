/**
 * Created by Dennis on 18/05/17.
 */

import {scigraph_endpoint, wikidata_endpoint} from "../../../config"
import ResultSetKnowledgeBase from "../resultSetKnowledgeBase"

export default class ResultSetScigraph extends ResultSetKnowledgeBase{

  constructor(k,l){
    super(k,l);
    this.kb = "scigraph";
  }

  get(query,lang,callback){
      var SparqlParser = require('sparqljs').Parser;
      var parser = new SparqlParser();
      var parsedQuery = parser.parse(this.query);
      console.log(parsedQuery);
      if (parsedQuery.variables[0].hasOwnProperty("variable")){
        var variable = parsedQuery.variables[0].variable;
      } else {
        var variable = parsedQuery.variables[0];
      }
      variable = variable.substring(1,variable.length);
      //Retrive information about the uri from the endpoint
      var sparqlQuery = "PREFIX sg: <http://scigraph.springernature.com/ontologies/core/> "+
        "PREFIX owl: <http://www.w3.org/2002/07/owl#> " +
        "SELECT ?"+variable+" ?pageRank ?label ?doi ?homepage ?issn ?wikilink ?lat ?long where { " +
        "{ SELECT ?"+variable+" where { " +
        "{ "+query+" }" +
        "}} " +
        "  OPTIONAL{ " +
        //"<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" || lang(?label)=\"de\" || lang(?label)=\"fr\" || lang(?label)=\"it\")" +
        "    ?" + variable + " sg:publishedName ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    ?" + variable + "  sg:title ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    ?" + variable + "  <http://www.w3.org/2000/01/rdf-schema#label> ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    ?" + variable + "  <http://www.w3.org/2004/02/skos/core#prefLabel> ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    ?" + variable + "  sg:doiLink ?doi . " +
        "  } " +
        "  OPTIONAL{ " +
        "    ?" + variable + "  sg:doi ?doi . " +
        "  } " +
        "  OPTIONAL{ " +
        "    ?" + variable + "  sg:webpage ?homepage . " +
        "  } " +
        "  OPTIONAL{ " +
        "    ?s ?p ?" + variable + " . " +
        "    ?s <http://scigraph.springernature.com/ontologies/core/issn> ?issn " +
        "  } " +
        "  OPTIONAL{ " +
        "    ?" + variable + "  <http://www.grid.ac/ontology/wikipediaPage> ?wikilink . " +
        "  } " +
        "  OPTIONAL{ " +
        "    ?" + variable + "  <http://www.grid.ac/ontology/hasAddress> ?o . " +
        "    ?o <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat " +
        "  } " +
        "  OPTIONAL{ " +
        "    ?" + variable + "  <http://www.grid.ac/ontology/hasAddress> ?o . " +
        "    ?o <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?long " +
        "  } " +
        "} ";
      console.log(sparqlQuery);
      var url = scigraph_endpoint +"?query=" + encodeURIComponent(sparqlQuery) + "&format=json";
      console.log(url);
      $.get(url).success(function (result) {
        console.log(result);
        var informationItem = Object.assign({}, this.informationItem);
        var previewsKey = result.results.bindings[0][variable].value;
        for (var i=0; i< result.results.bindings.length; i++) {
          informationItem.kb = this.kb;
          var actualKey = result.results.bindings[i][variable].value;
          if (!(actualKey == previewsKey)) {
            this.information.push(informationItem);
            informationItem = Object.assign({}, this.informationItem);
            previewsKey = actualKey;
          }
          var type = result.results.bindings[i][variable].type;
          var value = result.results.bindings[i][variable].value;
          if (type == "literal" || type == "typed-literal") {
            this.literal(result,i,variable,lang,informationItem)
          } else {
            informationItem.uri = actualKey;
            //informationItem.pageRank = result.results.bindings[i].pageRank.value;
            informationItem.links = {};
            informationItem.links.wikidata = actualKey;
            if (result.results.bindings[i].label != undefined) {
              if (informationItem.label == null) {
                informationItem.label = result.results.bindings[i].label.value;
              }
            }

            if (result.results.bindings[i].long != undefined && result.results.bindings[i].lat != undefined) {
              informationItem.lat = parseFloat(result.results.bindings[i].lat.value);
              informationItem.long = parseFloat(result.results.bindings[i].long.value);
            }


            if (result.results.bindings[i].homepage != undefined) {
              informationItem.links.homepage = result.results.bindings[i].homepage.value;
              // http://static-content.springer.com/cover/journal/10115.jpg
              if (result.results.bindings[i].homepage.value.includes("http://link.springer.com/journal/")){
                informationItem.image = "http://static-content.springer.com/cover/journal/"+result.results.bindings[i].homepage.value.replace("http://link.springer.com/journal/","")+".jpg";
              }
            }

            if (result.results.bindings[i].issn != undefined) {
              var issn = result.results.bindings[i].issn.value;

              informationItem.abstract = "Imagine here a nice description of this journal ; )" ;
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

            if (result.results.bindings[i].doi != undefined) {
              var doi = result.results.bindings[i].doi.value;
              informationItem.links.doi = doi;

              // //Retrive the abstract from springer api
              // url = "http://api.springer.com/metadata/json/doi/"+doi.replace("http://dx.doi.org/","")+"?api_key=93f11aed022b47339ab260ea464512f6";
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
              //   if (result.results.bindings[0].wikilink == undefined){
              //     return callback();
              //   }
              // })
            }

            if (result.results.bindings[i].wikilink != undefined) {
              informationItem.links.wikipedia = result.results.bindings[i].wikilink.value;
            }
          }
        }
        this.information.push(informationItem);
        // this.information.sort(function(a, b){
        //   return b.pageRank - a.pageRank;
        // });
        return callback();
      }.bind(this))
    }
}


