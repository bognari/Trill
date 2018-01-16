/**
 * Created by Dennis on 18/05/17.
 */

import {dblp_endpoint, dbpedia_endpoint} from "../../../config"
import ResultSetKnowledgeBase from "../resultSetKnowledgeBase"

export default class ResultSetDblp extends ResultSetKnowledgeBase{

  constructor(k,l){
    super(k,l);
    this.kb = "dblp";
  }

  get(query,lang,callback){
      var SparqlParser = require('sparqljs').Parser;
      var parser = new SparqlParser();
      var parsedQuery = parser.parse(this.query);
      if (parsedQuery.variables[0].hasOwnProperty("variable")){
        var variable = parsedQuery.variables[0].variable;
      } else {
        var variable = parsedQuery.variables[0];
      }
      variable = variable.substring(1,variable.length);

      //Retrive information about the uri from the endpoint
      var sparqlQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/> "+
        "PREFIX owl: <http://www.w3.org/2002/07/owl#> " +
        "SELECT ?"+variable+" ?pageRank ?label ?doi where { " +
        "{ SELECT ?"+variable+" where { " +
        "{ "+query+" }" +
        "}} " +
        // + "OPTIONAL { "
        // + "  graph <http://dbpedia.com/pageRank> { "
        // + "    ?"+variable+" <http://purl.org/voc/vrank#pagerank> ?pageRank .  "
        // + "}} " +
        "  OPTIONAL{ " +
        "    ?" + variable + "  <http://www.w3.org/2000/01/rdf-schema#label> ?label . " +
        "  } " +
        "  OPTIONAL{ " +
        "    ?" + variable + "  foaf:homepage ?doi . " +
        "    FILTER ( regex(str(?doi), \"https://doi.org/\" )) " +
        "  } " +
        "} ";
      console.log(sparqlQuery);
      var url = dblp_endpoint +"?query=" + encodeURIComponent(sparqlQuery) + "&format=json";
      $.get(url).success(function (result) {
        console.log(result);
        var informationItem = Object.assign({}, this.informationItem);
        var previewsKey = result.results.bindings[0][variable].value;
        for (var i=0; i< result.results.bindings.length; i++) {
          var actualKey = result.results.bindings[i][variable].value;
          informationItem.kb = this.kb;
          if (!(actualKey == previewsKey)) {
            this.information.push(informationItem);
            informationItem = Object.assign({}, this.informationItem);
            previewsKey = actualKey;
          }
          var type = result.results.bindings[i][variable].type;
          if (type == "literal" || type == "typed-literal") {
            this.literal(result,i,variable,lang,informationItem)
          } else {
            informationItem.uri = actualKey;
            //informationItem.pageRank = result.results.bindings[i].pageRank.value;
            informationItem.links = {};
            informationItem.links.dblp = actualKey;
            if (result.results.bindings[i].label != undefined) {
              if (informationItem.label == null) {
                informationItem.label = result.results.bindings[i].label.value;
              }
            }

            if (result.results.bindings[i].wikilink != undefined) {
              informationItem.links.wikipedia = result.results.bindings[i].wikilink.value.replace("http://","https://");
            }

            if (result.results.bindings[i].doi != undefined) {
              var doi = result.results.bindings[i].doi.value;
              informationItem.links.doi = doi;
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


