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
import SparqlList from '../SparqlList';
import Interpretation from '../Interpretation';
import Entity from '../DidYouMean';
import AnswerListElement from '../AnswerListElement/AnswerListElement'
import LazyLoad from 'react-lazy-load';
import Confidence from "../Confidence/Confidence";

@connect((store) => {
  return {
    uriInput: store.qa.uriInput,
    query_question: store.route.query, //input over the uri get parameters
    query_lang: store.route.lang,
    query_kb: store.route.kb,

    question: store.qa.question,  //input over the information in the store
    namedGraph: store.qa.namedGraph,
    information: store.qa.information,
    SPARQLquery: store.qa.SPARQLquery,    //containes the generated sparql query
    loaded: store.qa.loaded,              //indicates if the backend already gave back the answer
    error: store.qa.error,
    audiofile: store.qa.audiofile,
    qinitiated: store.qa.qinitiated,
    language: store.lang.language,
    knowledgebase: store.knowledgebase.knowledgebase,
    informationLoaded : store.qa.informationLoaded,
  }
})

class AnswerPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={s.container}>
        {this.props.knowledgebase=="musicbrainz" ? <div className={s.development}>QA over Musicbrainz is under development !!!! </div> : null}
        {this.props.knowledgebase=="dblp" ? <div className={s.development}>QA over Dblp is under development !!!! </div> : null}
        <Loader loaded={this.props.loaded} color="#333">

          {(this.props.error) ? <Error>Error</Error> :
            <div className={s.feedback}>
              <div className={s.buttonmenu}>
                {//<Confidence query={this.props.SPARQLquery[0]}/>}
                <SparqlList sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/>
                {(this.props.SPARQLquery != "") ? <Entity sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/> : null}
              </div>
              <Feedback/>
              <Interpretation sparqlquery={this.props.SPARQLquery[0]} namedGraph={this.props.namedGraph}/>
            </div>}

          {this.props.information.map(function (info, index) {
            return (
              <div key={index}>
                { (index < 20) ?
                  <AnswerListElement id={index} index={index} information={info} loaded={this.props.informationLoaded[index]}>
                  </AnswerListElement>
               : null }
              </div>
            )}.bind(this))}
        </Loader>
        <div className={s.bottom}/>
      </div>
    );
  }

}

export default withStyles(AnswerPage, s);
