import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DidYouMean.scss';
import $ from 'jquery';
import {pushQueries} from '../../actions/qanary_push';
import {questionansweringfull} from '../../actions/qanary';
import {dbpedia_endpoint, wikidata_endpoint} from '../../config';

@connect((store) => {
  return {
    language: store.lang.language,
    knowledgebase: store.knowledgebase.knowledgebase,
  }
})


class DidYouMean extends Component {

  static propTypes = {
    sparqlquery: PropTypes.array,
    namedGraph: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      entities: [],
      loaded: [],
      query: false, //indicates if the answer or the query is displayed
      selectedQuery: false,
      image: "",
      //entities: [],
    };
    this.handleClick = this.handleClick.bind(this);
  }

  static contextTypes = {
    owner: PropTypes.element,
  }



  handleClick3(spqno, e){
    //reorder queries
    var replacedsparql = this.props.sparqlquery;//note: the changes made to replacedsparql, will also happen to sparqlquery

    var selectedq;
    console.log("These are the indexes of the respective queries to arange: ", spqno);
    console.log("This is the replacedsparql before any modification: ", replacedsparql);

    for (var i=spqno.length-1; i>=0; i--){//need to go backwards so that when we are placing the queries at the front of the query list, we maintain their order
      selectedq = {query: this.props.sparqlquery[spqno[i]+spqno.length-1-i].query, score: replacedsparql[0].score + 100};
      console.log("THis is the selectedq index: ", spqno[i]);
      console.log("This is the index we are retrieving: ", spqno[i]+spqno.length-1-i);
      console.log("THis is the selectedq: ", this.props.sparqlquery[spqno[i]+spqno.length-1-i]);
      replacedsparql.unshift(selectedq);
      replacedsparql.splice(spqno[i]+spqno.length-i,1);
      console.log("This is the replacedsparql at each loop: ", replacedsparql);
    }

    //push queries to qanary triplestore
    this.props.dispatch(pushQueries(replacedsparql,this.props.language,this.props.knowledgebase,this.props.namedGraph)).then(() =>
      this.props.dispatch(questionansweringfull(100, this.props.language, this.props.knowledgebase, this.props.namedGraph))
    );

  }

  handleClick(){
    console.log("THIS"+this);
    var entities = []; //Array that holds the list of entities extracted from the SPARQL list.
    //Properties of each entity: value (name), entity (uri) and sparqlno (the indexes of the queries that hold this entity)

    var desiredString=""; //This is the entity name extracted from the uri
    var entitylink=""; //This is the uri of the entity

    this.props.sparqlquery.map(function(sparqlquery, qindex) {
      desiredString = (getFromBetween.get(sparqlquery.query,(this.props.knowledgebase == "wikidata") ? "<http://www.wikidata.org/entity/" : "<http://dbpedia.org/resource/",">"));

      //Here we extract the entities from the queries list and construct the entities array to hold these entities
      //alongside the index of the query from which it was retrieved.
      desiredString.map(function(entityname){ //This is a .map function because more than one entity may be pulled from a SPARQL query
        if(this.props.knowledgebase == "wikidata"){
          entitylink = "<http://www.wikidata.org/entity/"+entityname+">";
        }
        else {
          entitylink = "<http://dbpedia.org/resource/" + entityname + ">";
          entityname = entityname.replace(/_/g, " ");
        }

        //Here we perform a check to see if the current entity has already been stored in the entity array
        var indexofentity = -1;
        for(var i=0; i< entities.length; i++){
          if(entityname==entities[i].value){
            indexofentity = i;
            var spno = entities[i].sparqlno;
            if(spno.indexOf(qindex) == -1){//check if there isn't already a reference to this query in the sparqlno list, since an entity can be in a query more than once
              spno[spno.length] = qindex;//add the index of the current query to the list
              entities[i].sparqlno = spno;
            }
            break;
          }
        }
        if(indexofentity == -1){//If the above check proved the entity wasn't already stored, add it to the entities array
          var spno = [];
          spno[0] = qindex;
          entities[entities.length] = {value: entityname, label: null, description: null, image: null, entity: entitylink, sparqlno:spno};
        }
      }.bind(this));

    }.bind(this));
    this.setState({entities: entities});
    console.log("These are the entities: ", entities);

    for (let i =0; i < entities.length; i++) {
      var entityitem = entities[i];
      var sparqlQuery = "PREFIX dbo: <http://dbpedia.org/ontology/> select ?image where { OPTIONAL{ " + entityitem.entity + " dbo:thumbnail ?image . } } ";

      var wikiQuery = "PREFIX wdt: <http://www.wikidata.org/prop/direct/> " +
        "PREFIX wd: <http://www.wikidata.org/entity/> " +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  " +
        "PREFIX schema: <http://schema.org/> " +
        "select ?label ?description ?image where { " +
        "OPTIONAL{ " +
        "wd:" + entityitem.value + " rdfs:label ?label . FILTER (lang(?label)=\"" + this.props.language + "\") . " +
        "} " +
        "OPTIONAL{ " +
        "wd:" + entityitem.value + " wdt:P18 ?image . " +
        "} " +
        "OPTIONAL{ " +
        "wd:" + entityitem.value + " schema:description ?description . FILTER (lang(?description)=\"" + this.props.language + "\") . " +
        "} " +
        "}";
      console.log(wikiQuery);
      $.get(
        (this.props.knowledgebase == "wikidata") ? wikidata_endpoint + "?query=" + encodeURIComponent(wikiQuery) + "&format=json" :
          dbpedia_endpoint + "?query=" + encodeURIComponent(sparqlQuery) + "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on",
        function (result) {
          var newState = this.state.entities;
          if (result.results.bindings[0].label != undefined) {
            newState[i].label = result.results.bindings[0].label.value;
          }
          if (result.results.bindings[0].description != undefined) {
            var description = result.results.bindings[0].description.value.split(" ");
            newState[i].description = "";
            for (var l =0; l<Math.min(description.length,5); l++){
              newState[i].description += description[l] + " ";
            }
            if (description.length > 5){
              newState[i].description += description[l] + " ...";
            }
          }
          if (result.results.bindings[0].image != undefined) {
            newState[i].image = result.results.bindings[0].image.value+"?width=100";
          }
          this.setState({entities: newState});
        }.bind(this));
    }
    this.setState({query: !this.state.query}); //on click switch from query to answer
  }

  render() {
    return (
      <div className={s.container}>
        <div className={s.wrapfloat}>
          <div id="q" onClick={this.handleClick} className={(this.state.query) ? s.sparqlpressed : s.sparql}>
            &nbsp;Did you mean...&nbsp;
          </div>
        </div>
        {(this.state.query) ?
          <div id="FiringEntity" className={s.qbox}>
            {this.state.entities.map(function (entityitem, index) {
              return (
                <div key={index} className={s.entitybox} onClick={this.handleClick3.bind(this, entityitem.sparqlno)}>
                  {entityitem.image!= null ? <img src={entityitem.image} className={s.img}/> : null}
                  <div>
                    {entityitem.label!= null ?
                      <p className={s.entitylabel}> {entityitem.label} </p> :
                      <p className={s.entitylabel}> {entityitem.value} </p>
                    }
                    {entityitem.description!=null ? <p className={s.edesc}>{entityitem.description}</p> : null}
                  </div>
                </div>)
            }.bind(this))
            }
          </div>: null
        }
      </div>
    );
  }

}


export default withStyles(DidYouMean, s);


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
