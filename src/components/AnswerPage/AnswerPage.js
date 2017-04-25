/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux'

import ImageComponent from '../ImageComponent'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AnswerPage.scss';
import Label from '../Label';
import Loader from 'react-loader';
import MapBox from '../MapBox';
import TopK from '../TopK';
import Error from '../Error';
import Feedback from '../Feedback';
import Sparql from '../Sparql';
import Interpretation from '../Interpretation';
import Entity from '../Entity';
import LinksBar from '../LinksBar';
import {startQuestionAnsweringWithTextQuestion} from '../../actions/queryBackend';

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
  }
})

class AnswerPage extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.uriInput == true) {
      this.props.dispatch({type: 'SET_QUESTION', question: this.props.query});
      this.props.dispatch(startQuestionAnsweringWithTextQuestion(this.props.query, this.props.language, this.props.knowledgebase));
    }
  }

  render() {
    return (
      <div className={s.container}>

        <Loader loaded={this.props.loaded} color="#333">

      {(this.props.error) ? <Error>Error</Error> :
        <div className={s.feedback}>
          <div className={s.buttonmenu}>
          <Sparql sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/>
          <Interpretation sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/>
            {(this.props.SPARQLquery != "") ? (this.props.SPARQLquery[0].query.indexOf("dbpedia") > -1) ? <Entity sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/> : null : null}
          </div>
          <Feedback/>
        </div>}

          {this.props.information.map(function (info, index) {
            return (
              <div className={s.contentholder}>
                {(info.answertype == "simple") ? <Label type="title">{info.label}</Label> : null}

                {(info.answertype == "noinfo") ?
                  <a href={info.link} className={s.link}><Label type="title">{info.label}</Label></a> : null}

                {(info.answertype == "detail") ?
                  <div className={s.leftColumn}>
                    <div className={s.title}><p>{info.label}</p>
                      <LinksBar wikipedia={info.link} uri={info.uri} /></div>
                    {(info.abstract != "") ? <Label>{info.abstract}</Label> : null}
                  </div> : null}
                {(info.answertype == "map") ?
                  <div className={s.leftColumn}>
                    <div className={s.title}><p>{info.label}</p>
                      <LinksBar wikipedia={info.link} uri={info.uri} /></div>
                    {(info.abstract != "") ? <Label>{info.abstract}</Label> : null}
                    <MapBox mapid={"map" + info.key} lat={info.lat} long={info.long}></MapBox>
                  </div> : null}

                {(info.answertype == "detail" || info.answertype == "map") ?
                  <div className={s.rightColumn}>
                    {(info.image != "") ?
                      <ImageComponent key={"image" + info.key} image={info.image}></ImageComponent> : null}
                    <TopK sumid={"sumbox" + info.key} uri={info.uri} topK={5} lang={this.props.language}/>
                  </div> : null}
              </div>
            )
          }.bind(this))}
        </Loader>
      </div>
    );
  }


}
export default withStyles(AnswerPage, s);
