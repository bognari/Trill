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
import s from './SparqlList.scss';
import Interpretation from '../Interpretation';
import {questionansweringfull} from '../../actions/qanary';
import {qanary_endpoint} from '../../config';


@connect((store) => {
  return {
    question: store.qa.question,
    SPARQLquery: store.qa.SPARQLquery,
    namedGraph: store.qa.namedGraph,
    language: store.lang.language,
    knowledgebase: store.knowledgebase.knowledgebase,
  }
})
class SparqlList extends Component {

  static propTypes = {

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
  }

  handleClick2(selectedquery, index, e){

    var replacedsparql = this.props.sparqlquery ;
    replacedsparql[0].query = selectedquery; //replace the first query with the selected query
    replacedsparql[0].score = replacedsparql[0].score+100; //increase its score
    replacedsparql.splice(index, 1); //remove the selected query from where it was in the list before
    console.log("This is the updated sparql queries list: ",replacedsparql);

    var sparqlPart1 = "";
    var sparqlPart2 = "";
    //console.log("this is the index you selected: ", index);

    for (var i=0; i<Math.min(replacedsparql.length ,30); i++){
      sparqlPart1+=" ?a"+i+" a qa:AnnotationOfAnswerSPARQL . "
        + "  ?a"+i+" oa:hasTarget <URIAnswer> . "
        + "  ?a"+i+" oa:hasBody \"" +  replacedsparql[i].query.replace("\n", " ") + "\" ;"
        + "     oa:annotatedBy <www.wdaqua.eu> ; "
        + "         oa:annotatedAt ?time ; "
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
      url: qanary_endpoint,
      type: "POST",
      contentType: 'application/x-www-form-urlencoded',
      data: {query: sparql},
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa("admin:admin"));
        xhr.setRequestHeader('Accept', 'application/sparql-results+json');
      },
      success: function (result) {
        this.props.dispatch(questionansweringfull(100, this.props.lang, this.props.knowledgebase, this.props.namedGraph));
      }.bind(this)
    })
  }

  render() {
    return (
      <div className={s.container}>
        <div className={s.wrapfloat}>
        <div id="q" onClick={this.handleClick} className={(this.state.query) ? s.sparqlpressed : s.sparql}>
          Q
        </div>
        </div>
              {(this.state.query) ?
                <div id="FiringSparql" className={s.qbox}>
                  {this.props.sparqlquery.map(function (newitems, index) {
                    return (
                      <div key={index}>
                        <p id={"q"+index} >
                        <input type="radio" className={s.sparqlmenu} name = "selectquery" value = {newitems.query} onClick={this.handleClick2.bind(this, newitems.query,index)}>&nbsp; &nbsp; {newitems.query} </input>
                          <Interpretation sparqlquery={newitems} namedGraph={this.props.namedGraph}/>

                        </p>
                      </div>)

                        }.bind(this))
                  }
                </div> : null
              }
      </div>
    );
  }

}
export default withStyles(SparqlList, s);
