/**
 * Trill (http://www.wdaqua.eu/)
 *
 * Copyright © 2014-2017 University Jean Monet, All rights reserved.
 *
 */

import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux'


import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AnswerPage.scss';
import Loader from 'react-loader';
import Error from '../Error';
import Feedback from '../Feedback';
import Sparql from '../Sparql';
import SparqlList from '../SparqlList';
import Interpretation from '../Interpretation';
import Entity from '../DidYouMean';
import AnswerListElement from '../AnswerListElement/AnswerListElement'
import {questionansweringfull} from '../../actions/qanary';

@connect((store) => {
  return {
    question: store.qa.question,
    namedGraph: store.qa.namedGraph,
    information: store.qa.information,
    SPARQLquery: store.qa.SPARQLquery,    //containes the generated sparql query
    query: store.route.query,                //indicates if the answer or the query is displayed
    loaded: store.qa.loaded,              //indicates if the backend already gave back the answer
    error: store.qa.error,
    audiofile: store.qa.audiofile,
    qinitiated: store.qa.qinitiated,
    language: store.lang.language,
    uriInput: store.qa.uriInput,
    knowledgebase: store.knowledgebase.knowledgebase,
    informationLoaded : store.qa.informationLoaded,
  }
})

class AnswerPage extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("HALLO",this.props.query);
    if (this.props.uriInput == true) {
      this.props.dispatch({type: 'SET_QUESTION', question: this.props.query});
      this.props.dispatch(questionansweringfull(this.props.query, this.props.language, this.props.knowledgebase));
    }
  }

  render() {
    return (
      <div className={s.container}>
        <Loader loaded={this.props.loaded} color="#333">

          {(this.props.error) ? <Error>Error</Error> :
            <div className={s.feedback}>
              <div className={s.buttonmenu}>
                <SparqlList sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/>
                {(this.props.SPARQLquery != "") ? <Entity sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/> : null}
              </div>
              <Feedback/>
              <Interpretation sparqlquery={this.props.SPARQLquery[0]} namedGraph={this.props.namedGraph}/>


            </div>}

          {this.props.information.map(function (info, index) {
            return (
              <div key={index}>
                <div className="filler" />
                <AnswerListElement id={index} index={index} information={info}>
                </AnswerListElement>
              </div>
            )}.bind(this))}
        </Loader>
      </div>
    );
  }


}
export default withStyles(AnswerPage, s);
