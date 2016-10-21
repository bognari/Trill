/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import ImageComponent from '../ImageComponent'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AnswerPage.scss';
import $ from 'jquery';
import Label from '../Label';
import Loader from 'react-loader';
import MapBox from '../MapBox';
import TopK from '../TopK';

function sendQueryToEndpoint(data, comp){
  var sparqlQuery =  "PREFIX qa: <http://www.wdaqua.eu/qa#> "
    + "PREFIX oa: <http://www.w3.org/ns/openannotation/core/> "
    + "SELECT ?sparql ?json "
    + "FROM <"+  data.graph.toString() + "> "
    + "WHERE { "
    + "  ?a a qa:AnnotationOfAnswerSPARQL . "
    + "  ?a oa:hasBody ?sparql . "
    + "  ?b a qa:AnnotationOfAnswerJSON . "
    + "  ?b oa:hasBody ?json "
    + "}";

  // + "PREFIX oa: <http://www.w3.org/ns/openannotation/core/> "
  // + "SELECT ?sparql ?json "
  // + "FROM <"+  data.graph.toString() + "> "
  // + "WHERE { "
  // + "  ?a a qa:AnnotationOfAnswerSPARQL . "
  // + "  ?a oa:hasBody ?sparql . "
  // + "  ?b a qa:AnnotationOfAnswerJSON . "
  // + "  ?b oa:hasBody ?json "
  // + "  ?c a qa:AnnotationOfTextRepresentation . "
  // + " ?c oa:hasBody ?uriText ."
  // + "}";

  comp.serverRequest = $.ajax({
    url: "http://wdaqua-endpoint.univ-st-etienne.fr/qanary/query?query=" + encodeURIComponent(sparqlQuery),
    type: "GET",
    beforeSend: function(xhr){
      xhr.setRequestHeader ("Authorization", "Basic " + btoa("admin:admin"));
      xhr.setRequestHeader('Accept', 'application/sparql-results+json');
    },
    success: function(result) {
      var query = result.results.bindings[0].sparql.value;
      var jresult = JSON.parse(result.results.bindings[0].json.value);

      configureResult(query, jresult, comp);

    }.bind(comp)
  });
}

function configureResult(query, jresult, comp){

  var count = 0;

  //check if it is an ask query
  if (jresult.hasOwnProperty("boolean")){
    var information = comp.state.information;
    information.push({
      label: (jresult.boolean==true) ? "True" : "False",
      answerType: "simple",
    })
    comp.setState({
      SPARQLquery: query,
      information: information,
      loaded: true,
    })
  } else {
    var variable=jresult.head.vars[0];
    //depending on the number of results, handle accordingly:
    if(jresult.results.bindings.length > 0 && jresult.results.bindings.length <= 1000) {
      jresult.results.bindings.map(function(binding,k) {
        if (k<20) {
          console.log("k:" + k);
          console.log(variable);
          //console.log("Variable" + jresult.head.vars[0]);
          //var variable = jresult.head.vars[0];

          var type = binding[variable].type;
          var value = binding[variable].value;
          console.log("Result " + type + " " + value);

          if (type == "uri") {
            //There is only one uri
            var sparqlQuery = "select ?label ?abstract ?image ?lat ?long ?wikilink where { "
              + " OPTIONAL{ "
              + "<" + value + "> rdfs:label ?label . "
              + "} "
              + " OPTIONAL{ "
              + "<" + value + "> dbo:thumbnail ?image . "
              + "} "
              + " OPTIONAL{ "
              + "<" + value + "> dbo:abstract ?abstract . "
              + "} "
              + " OPTIONAL{ "
              + "<" + value + "> geo:lat ?lat . "
              + "} "
              + " OPTIONAL{ "
              + "<" + value + "> geo:long ?long . "
              + "} "
              + " OPTIONAL{ "
              + "?wikilink foaf:primaryTopic <" + value + "> . "
              + "} "
              + " FILTER (lang(?label)=\"en\" && lang(?abstract)=\"en\") "
              + " } ";

            comp.serverRequest = $.get(
              "http://dbpedia.org/sparql?query=" + encodeURIComponent(sparqlQuery) + "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on",
              function (result) {
                console.log("The properties query result is: .............................");
                console.log(result);

                var information = comp.state.information;

                //to refactor the following if statements to one switch statement? I.e. do a checks on the result to
                //determine and set answertype
                if (typeof result.results.bindings[0]=="undefined") { //Case when there is no information... is it a possible scenario?
                  information.push({
                    label: value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
                    loaded: true,
                    answertype: "noinfo",
                    link: value,
                    count: count++,
                  })
                }

                else if (result.results.bindings[0].lat != undefined) { //case there are geo coordinates

                  console.log("Label: " + result.results.bindings[0].label.value);
                  console.log("Abstract: " + result.results.bindings[0].abstract.value);

                  information.push({
                    label: (result.results.bindings[0].label != undefined) ? result.results.bindings[0].label.value : value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
                    abstract: result.results.bindings[0].abstract.value,
                    image: (result.results.bindings[0].image != undefined) ? result.results.bindings[0].image.value : "",
                    loaded: true,
                    answertype: "map",
                    uri: value,
                    link: (result.results.bindings[0].wikilink != undefined) ? result.results.bindings[0].wikilink.value : value,
                    count: count++,
                    lat: result.results.bindings[0].lat.value,
                    long: result.results.bindings[0].long.value,
                  })
                }

                else {//case of regular detailed answer

                  console.log("Label: " + result.results.bindings[0].label.value);
                  console.log("Abstract: " + result.results.bindings[0].abstract.value);

                  information.push({
                    label: (result.results.bindings[0].label != undefined) ? result.results.bindings[0].label.value : value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
                    abstract: result.results.bindings[0].abstract.value,
                    image: (result.results.bindings[0].image != undefined) ? result.results.bindings[0].image.value : "",
                    loaded: true,
                    answertype: "detail",
                    uri: value,
                    link: (result.results.bindings[0].wikilink != undefined) ? result.results.bindings[0].wikilink.value : value,
                    count: count++,
                  })
                }

                comp.setState({
                  SPARQLquery: query,
                  information: information,
                  loaded: true,
                });

              }.bind(comp), "json")
          }
          else if (type == "typed-literal" || type == "literal") {
            var information = comp.state.information;
            information.push({
              label: binding[variable].value,
              loaded: true,
              answertype: "simple",
              count: count++,
            })
            comp.setState({
              SPARQLquery: query,
              information: information,
              loaded: true,
            });
          }
        }
      }.bind(comp), "json")
    }
    else { //if there are no results
      comp.setState({
        SPARQLquery: query,
        label: "No results",
        loaded: true,
        answertype: "simple"
      });
    }
  }
}

class AnswerPage extends Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      information: [],
      SPARQLquery: "", //containes the generated sparql query
      query: false, //indicates if the answer or the query is displayed
      loaded: false, //indicates if the backend already gave back the answer
    };
    this.handleClick = this.handleClick.bind(this);
  }


  componentDidMount() {

    if(false){//to check for blob

    }
    else{
      var questionresult = $.post("http://wdaqua-qanary.univ-st-etienne.fr/startquestionansweringwithtextquestion", "question=" + this.props.query.query + "&componentlist[]=wdaqua-core0", function (data) {

        sendQueryToEndpoint(data, this);

      }.bind(this));
    }

    // qresult.done(function (data){
    //   console.log("This is when the get finishes............:");
    //   console.log(" ");
    // });

  }

  handleClick() {
    this.setState({query: !this.state.query}); //on click switch from query to answer
  }

  render() {
    console.log("query paramsss...............:");
    console.log(this.props.query);

    // var answerformat;
    // if (this.state.answertype == "simple") {
    //   answerformat = <Label>{this.state.abstract}</Label>;
    // } else if (this.state.answertype == "detail") {
    //   answerformat = ();
    // }
    // else {}

//to refactor so don't have to check the same answer type multiple times
    console.log("Loaded "+this.state.loaded);
    console.log("Information "+this.state.information.length);

    return (
      <div className={s.container}>
        <Loader loaded={this.state.loaded}>
          <div onClick={this.handleClick} className={s.sparql}>
            Q
          </div>
          <br/>
          <br/>
          {(this.state.query) ? <Label>{this.state.SPARQLquery}</Label> : null}
          {this.state.information.map(function(info,index) {
            console.log("k"+index);
            console.log(info);
            return (
              <div key={index} >
                 {(info.answertype == "simple") ? <Label type="title">{info.label}</Label> : null}

                 {(info.answertype == "noinfo") ? <a href={info.link} className={s.link}><Label type="title">{info.label}</Label></a> : null}

                {(info.answertype == "detail") ?
                   <div className={s.leftColumn}>
                   <a href={info.link} className={s.link}><Label type="title">{info.label}</Label></a>
                   <Label>{info.abstract}</Label>
                 </div> : null}
                {(info.answertype == "map") ?
                  <div className={s.leftColumn}>
                    <a href={info.link} className={s.link}><Label type="title">{info.label}</Label></a>
                    <Label>{info.abstract}</Label>
                    <MapBox lat={info.lat} long={info.long}></MapBox>
                  </div> : null}

                {(info.answertype == "detail" || "map") ?
                  <div className={s.rightColumn}>
                  <ImageComponent image={info.image}></ImageComponent>
                  <TopK sumid={"sumbox" + info.count} uri={info.uri} topK={5}/>
                </div> : null}

              </div>)
          }.bind(this), "json")}
        </Loader>

      </div>
    );
  }


}
export default withStyles(AnswerPage, s);
