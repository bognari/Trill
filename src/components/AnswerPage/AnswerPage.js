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
import Entity from '../Entity';

@connect((store) => {
  return {
    question: store.qa.question,
    namedGraph: store.qa.namedGraph,
    information: store.qa.information,
    SPARQLquery: store.qa.SPARQLquery,    //containes the generated sparql query
    query: store.qa.query,                //indicates if the answer or the query is displayed
    loaded: store.qa.loaded,              //indicates if the backend already gave back the answer
    error: store.qa.error,
  }
})
class AnswerPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    //to refactor so don't have to check the same answer type multiple times
    return (
      <div className={s.container}>
        <Loader loaded={this.props.loaded}>

          {(this.props.error) ? <Error>Error</Error> :
            <div className={s.buttonmenu}>
              <Sparql sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/>
              <Feedback question={this.props.question} sparql={this.props.SPARQLquery}/>
              <Entity entity={this.props.entity} sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/>
            </div>}

          {this.props.information.map(function(info,index) {
            return (
              <div className={s.contentholder} >
                {console.log("render")}
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
                    <MapBox mapid={"map" + info.count} lat={info.lat} long={info.long}></MapBox>
                  </div> : null}

                {(info.answertype == "detail" || info.answertype == "map") ?
                  <div className={s.rightColumn}>
                    {(info.image != "") ? <ImageComponent key={"image"+info.key}image={info.image}></ImageComponent>   : null}
                  <TopK sumid={"sumbox" + info.key} uri={info.uri} topK={5}/>
                </div> : null}

              </div>
              )
          })}
        </Loader>
      </div>
    );
  }


}
export default withStyles(AnswerPage, s);
