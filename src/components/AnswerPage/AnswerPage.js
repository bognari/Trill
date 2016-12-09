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
import LinksBar from '../LinksBar';
import Location from '../../core/Location';
import {startQuestionAnsweringWithTextQuestion, startQuestionAnsweringWithAudioQuestion} from '../../actions/queryBackend';
import {setQuestion} from '../../actions/setQuestion';

@connect((store) => {
  return {
    location: store.qa.location,
    question: store.qa.question,
    namedGraph: store.qa.namedGraph,
    information: store.qa.information,
    SPARQLquery: store.qa.SPARQLquery,    //containes the generated sparql query
    query: store.qa.query,                //indicates if the answer or the query is displayed
    loaded: store.qa.loaded,              //indicates if the backend already gave back the answer
    error: store.qa.error,
    audiofile: store.qa.audiofile,
    qinitiated: store.qa.qinitiated,
  }
})

class AnswerPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      previousquestion: "",
      previousaudio: null,
    };
  }

  componentDidMount() {
    if(this.props.audiofile != null){
      this.state.previousaudio = this.props.audiofile;
      this.props.dispatch(startQuestionAnsweringWithAudioQuestion(this.props.audiofile));
    }
    else{
      this.state.previousquestion = this.props.question;
      this.props.dispatch(startQuestionAnsweringWithTextQuestion(this.props.question));
    }
  }

  componentDidUpdate() {
    console.log("This is a testtttt");

    if(this.state.previousquestion != this.props.question && this.props.audiofile == null){
      console.log("We can start a new question answering because there is a new question");
      this.state.previousquestion = this.props.question;
      this.props.dispatch(startQuestionAnsweringWithTextQuestion(this.props.question));
    }
    else if(this.props.audiofile != null && this.state.previousaudio != this.props.audiofile){
      console.log("We can start audio question answering because there is a new audio question");
      this.state.previousaudio = this.props.audiofile;
      this.props.dispatch(startQuestionAnsweringWithAudioQuestion(this.props.audiofile));
    }
    else {
      console.log("We should not start qa, because something else changed in the store other than the question");
    }
  }

  render() {

    //if there is a refresh, then the user is redirected to the home page (because the store will be reset and the question will
    // be empty)

    // if (this.props.qinitiated == false) {
    //   Location.push("/");
    //   return (<div className={s.container}></div>);
    // }
    // else {
      //to refactor so don't have to check the same answer type multiple times
      return (
        <div className={s.container}>

          <Loader loaded={this.props.loaded} color="#333">

        {(this.props.error) ? <Error>Error</Error> :
          <div className={s.feedback}>
            <div className={s.buttonmenu}>
            <Sparql sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/>
            <Entity sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/>
            </div>
            <Feedback/>
          </div>}

            {this.props.information.map(function (info, index) {
              return (
                <div className={s.contentholder}>
                  {console.log("render")}
                  {(info.answertype == "simple") ? <Label type="title">{info.label}</Label> : null}

                  {(info.answertype == "noinfo") ?
                    <a href={info.link} className={s.link}><Label type="title">{info.label}</Label></a> : null}

                  {(info.answertype == "detail") ?
                    <div className={s.leftColumn}>
                      <div className={s.title}><p>{info.label}</p>
                        <LinksBar wiki={info.link} dbpedia={info.uri}/></div>
                      {(info.abstract != "") ? <Label>{info.abstract}</Label> : null}
                    </div> : null}
                  {(info.answertype == "map") ?
                    <div className={s.leftColumn}>
                      <div className={s.title}><p>{info.label}</p>
                        <LinksBar wiki={info.link} dbpedia={info.uri}/></div>
                      {(info.abstract != "") ? <Label>{info.abstract}</Label> : null}
                      <MapBox mapid={"map" + info.key} lat={info.lat} long={info.long}></MapBox>
                    </div> : null}

                  {(info.answertype == "detail" || info.answertype == "map") ?
                    <div className={s.rightColumn}>
                      {(info.image != "") ?
                        <ImageComponent key={"image" + info.key} image={info.image}></ImageComponent> : null}
                      <TopK sumid={"sumbox" + info.key} uri={info.uri} topK={5}/>
                    </div> : null}

                </div>
              )
            })}
          </Loader>
        </div>
      );
   // }
  }


}
export default withStyles(AnswerPage, s);
