/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Sparql.scss';
import {questionanswering} from '../../actions/queryBackend';

@connect((store) => {
  return {
  }
})
class Sparql extends Component {

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

  handleClick() {
    this.setState({query: !this.state.query}); //on click switch from query to answer
    document.querySelector("#q0").style="background-color: #f5f5f5";
    }

  handleClick2(selectedquery, index, e){

    var replacedsparql = this.props.sparqlquery ;
    replacedsparql[0].query = selectedquery;
    replacedsparql[0].score = replacedsparql[0].score+100;
    replacedsparql.splice(index, 1);
    console.log(replacedsparql);

    var sparqlPart1 = "";
    var sparqlPart2 = "";
    console.log("this is the index you selected: ", index);

    for (var i=0; i<Math.min(replacedsparql.length ,30); i++){
      sparqlPart1+=" ?a"+i+" a qa:AnnotationOfAnswerSPARQL . "
        + "  ?a"+i+" oa:hasTarget <URIAnswer> . "
        + "  ?a"+i+" oa:hasBody \"" +  replacedsparql[i].query.replace("\n", " ") + "\" ;"
        + "     oa:annotatedBy <www.wdaqua.eu> ; "
        + "         oa:AnnotatedAt ?time ; "
        + "         qa:hasScore "+ replacedsparql[i].score + " . \n";
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
        console.log("FIRE");
        this.props.dispatch(questionanswering(this.props.namedGraph, ["QueryExecuter"]));
      }.bind(this)
    })
  }

  render() {
    console.log("NAMED GRAPH");
    console.log(this.props);
    return (
            <div className={s.container}>
        <div id="q" onClick={this.handleClick} className={(this.state.query) ? s.sparqlpressed : s.sparql}>
          Q
        </div>
              {(this.state.query) ?
                <div id="FiringSparql" className={s.qbox}>
                  {this.props.sparqlquery.map(function (newitems, index) {
                    return (
                      <p id={"q"+index}>
                      <input type="radio" className={s.sparqlmenu} name = "selectquery" value = {newitems.query} onClick={this.handleClick2.bind(this, newitems.query,index)}>&nbsp; &nbsp; {newitems.query} </input>
                      </p>)
                        }.bind(this))
                  }
                </div>: null
              }

    </div>
    );
  }

}
export default withStyles(Sparql, s);
