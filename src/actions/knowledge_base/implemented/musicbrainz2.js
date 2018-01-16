/**
 * Created by Dennis on 18/05/17.
 */

import {musicbrainz_endpoint} from "../../../config"
import ResultSetKnowledgeBase from "../resultSetKnowledgeBase"

export default class ResultSetMusicbrainz extends ResultSetKnowledgeBase{

  constructor(k,l){
    super(k,l);
    this.kb = "musicbrainz";
  }

  get(query,lang,callback){
    console.log("ENTEREDDDDDDDDDDDDDDDD");
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
      var sparqlQuery = "PREFIX foaf: <http://xmlns.com/foaf/0.1/> "
        + "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> "
        + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  "
        + "PREFIX owl: <http://www.w3.org/2002/07/owl#> "
        + "SELECT ?"+variable+" ?pageRank ?label ?image ?coordinates ?wikilink ?owlSameAs where { "
        + "{ SELECT ?"+variable+" where { "
        + "{ "+query+" }"
        + "}} "
        + "OPTIONAL { "
        + "  graph <http://dbpedia.com/pageRank> { "
        + "    ?"+variable+" <http://purl.org/voc/vrank#pagerank> ?pageRank .  "
        + "}} "
        + "  OPTIONAL{ "
        //"<" + value + "> rdfs:label ?label . FILTER (lang(?label)=\""+ lang +"\" || lang(?label)=\"en\" || lang(?label)=\"de\" || lang(?label)=\"fr\" || lang(?label)=\"it\")"
        + "    ?" + variable + " foaf:name ?label . "
        + "  } "
        + "  OPTIONAL{ "
        + "    ?" + variable + "  <http://purl.org/dc/elements/1.1/title> ?label . "
        + "  } "
        + "  OPTIONAL{ "
        + "    ?" + variable + "  <http://www.w3.org/2000/01/rdf-schema#label> ?label . "
        + "  } "
        + "  OPTIONAL{ "
        + "    ?" + variable + "  foaf:isPrimaryTopicOf ?wikilink . "
        + "  } "
        + "  OPTIONAL{ "
        + "    ?" + variable + "  owl:sameAs ?owlSameAs . "
        + "  } "
        + "} ";
      console.log(sparqlQuery);
      var url = musicbrainz_endpoint +"?query=" + encodeURIComponent(sparqlQuery) + "&format=json";
      $.get(url).success(function (result) {
        console.log(result);
        var informationItem = Object.assign({}, this.informationItem);
        informationItem.kb = this.kb;
        var previewsKey = result.results.bindings[0][variable].value;
        for (var i=0; i< result.results.bindings.length; i++) {
          var actualKey = result.results.bindings[i][variable].value;
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
            informationItem.links = {};
            informationItem.links.musicbrainz = actualKey;
            if (result.results.bindings[i].label != undefined) {
              if (informationItem.label == null) {
                informationItem.label = result.results.bindings[i].label.value;
              }
            }

            if (result.results.bindings[i].image != undefined) {
              informationItem.image = result.results.bindings[i].image.value + "?width=300";
            }

            if (result.results.bindings[0].owlSameAs != undefined) {
              var link = result.results.bindings[0].owlSameAs.value;
              if (link.indexOf("http://dbpedia.org/resource") > -1){
                informationItem.links.dbpedia = link;
              }
            }

            if (result.results.bindings[i].wikilink != undefined) {
              informationItem.links.wikipedia = result.results.bindings[i].wikilink.value.replace("http://","https://");
            }
          }
        }
        this.information.push(informationItem);
        this.information.sort(function(a, b){
          return b.pageRank - a.pageRank;
        });
        return callback();
      }.bind(this))
    }
}


