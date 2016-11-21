import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Entity.scss';
import {questionanswering} from '../../actions/queryBackend';

var getFromBetween = {
  results:[],
  string:"",
  getFromBetween:function (sub1,sub2) {
    if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
    var SP = this.string.indexOf(sub1)+sub1.length;
    var string1 = this.string.substr(0,SP);
    var string2 = this.string.substr(SP);
    var TP = string1.length + string2.indexOf(sub2);
    return this.string.substring(SP,TP);
  },
  removeFromBetween:function (sub1,sub2) {
    if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
    var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
    this.string = this.string.replace(removal,"");
  },
  getAllResults:function (sub1,sub2) {
    // first check to see if we do have both substrings
    if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

    // find one result
    var result = this.getFromBetween(sub1,sub2);
    // push it to the results array
    this.results.push(result);
    // remove the most recently found one from the string
    this.removeFromBetween(sub1,sub2);

    // if there's more substrings
    if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
      this.getAllResults(sub1,sub2);
    }
    else return;
  },
  get:function (string,sub1,sub2) {
    this.results = [];
    this.string = string;
    this.getAllResults(sub1,sub2);
    return this.results;
  }
};


@connect((store) => {
  return {
   // entities: store.qa.entities,
  }
})


class Entity extends Component {

  static propTypes = {
    sparqlquery: PropTypes.array,
    namedGraph: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      query: false, //indicates if the answer or the query is displayed
      selectedQuery: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  static contextTypes = {
    owner: PropTypes.element,
  }

  /*groupingEntities(){
    var entities = [];
    entities.value = "";
    entities.sparlqlno = [];
    var desiredString="";
    {this.props.sparqlquery.map(function(sparqlquery) {
      desiredString = sparqlquery.query.substring(str.lastIndexOf("/") + 1, str.lastIndexOf(">"));
      for(var i=0; i<entities.length; i++){
        if(desiredString==entities[i].value){
          entities[i].sparlqlno[sparlqlno.length]=index;
        }else{
          entities[entities.length].value=desiredString;
          entities[entities.length].sparqlno[0]=index;
        }
      }
    })
  }
  }*/

  handleClick() {
    this.setState({query: !this.state.query}); //on click switch from query to answer
    document.querySelector("#q0").style="background-color: #f5f5f5";
  }

  handleClick3(spqno, e){
    var rplcSPARQL = this.props.sparqlquery ;
    var selectedquery=[];
    selectedquery[0] = {query:"" , score:0};
    var no=0;
    for(var i=0;i<spqno.length; i++){
      no = spqno[i];
      selectedquery=this.props.sparqlquery[no];
      console.log("this is the sparql we want: ",selectedquery);
      console.log("this is its number: ",no);
      rplcSPARQL[i].query = selectedquery.query;
      rplcSPARQL[i].score = selectedquery.score;
    }

    var sparqlPart1 = "";
    var sparqlPart2 = "";
    for (var i=0; i<Math.min(rplcSPARQL.length ,30); i++){
      sparqlPart1+=" ?a"+i+" a qa:AnnotationOfAnswerSPARQL . "
        + "  ?a"+i+" oa:hasTarget <URIAnswer> . "
        + "  ?a"+i+" oa:hasBody \"" +  rplcSPARQL[i].query.replace("\n", " ") + "\" ;"
        + "     oa:annotatedBy <www.wdaqua.eu> ; "
        + "         oa:annotatedAt ?time ; "
        + "         qa:hasScore "+ rplcSPARQL[i].score + " . \n";
      sparqlPart2+= " BIND (IRI(str(RAND())) AS ?a"+i+") . \n";
    }


    var sparql = "prefix qa: <http://www.wdaqua.eu/qa#> "
      + "prefix oa: <http://www.w3.org/ns/openannotation/core/> "
      + "INSERT { "
      + "GRAPH <" + this.props.namedGraph + "> { "
      + sparqlPart1
      + " }} "
      + "WHERE { "
      + sparqlPart2
      + "BIND (IRI(str(RAND())) AS ?b) . "
      + "BIND (now() as ?time) . "
      + "}";

    this.serverRequest = $.ajax({
      url: "http://wdaqua-endpoint.univ-st-etienne.fr/qanary/query",
      type: "POST",
      contentType: 'application/x-www-form-urlencoded',
      data: {query: sparql},
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa("admin:admin"));
        xhr.setRequestHeader('Accept', 'application/sparql-results+json');
      },
      success: function (result) {
        this.props.dispatch(questionanswering(this.props.namedGraph, ["QueryExecuter"]));
      }.bind(this)
    })
  }

  render() {
    var entities = [];
    var desiredString="";

    {this.props.sparqlquery.map(function(sparqlquery, qindex) {
      desiredString = (getFromBetween.get(sparqlquery.query,"<http://dbpedia.org/resource/",">"));
      console.log("This is the desired string: ", desiredString);

      //Here we take the entities from the queries and construct the entities array to hold these entities
      //alongside the index of the query from which it was retrieved
      desiredString.map(function(singlestring){
        singlestring = singlestring.replace(/_/g, " ");
        var indexofentity = -1;

        for(var i=0; i< entities.length; i++){
          if(singlestring==entities[i].value){
            indexofentity = i;
            break;
          }
        }

        if(indexofentity > -1){
          var spno = entities[indexofentity].sparqlno;
          spno[spno.length] = qindex;
          entities[indexofentity].sparqlno = spno;
        }
        else{
          var spno = [];
          spno[0] = qindex;
          entities[entities.length] = {value: singlestring, sparqlno:spno};
        }
      });

    })
  }
    console.log("this is the obj entities: ", entities);

    return (
      <div className={s.container}>
        <div id="q" onClick={this.handleClick} className={(this.state.query) ? s.sparqlpressed : s.sparql}>
          Q
        </div>
        {(this.state.query) ?
          <div id="FiringEntity" className={s.qbox}>
            {entities.map(function (entityitem, index) {
              return (
                <p id={"entity"+index}>
                  <input type="radio" className={s.sparqlmenu} name="selectentity" value={entityitem.value} onClick={this.handleClick3.bind(this, entities[index].sparqlno)}> &nbsp; {entityitem.value} </input>
                </p>)
            }.bind(this))
            }
          </div>: null
        }
      </div>
    );
  }

}
export default withStyles(Entity, s);
