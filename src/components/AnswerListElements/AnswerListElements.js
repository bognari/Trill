/**
 * Trill (http://www.wdaqua.eu/)
 *
 * Copyright © 2014-2017 University Jean Monet, All rights reserved.
 *
 */

import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {Condition, Case} from 'react-case';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import YouTube from 'react-youtube';


import ImageComponent from '../ImageComponent'
import s from './AnswerListElements.scss';
import Label from '../Label';
import MapBox from '../MapBox';
import TopK from '../TopK';
import LinksBar from '../LinksBar';

import {info} from '../../actions/knowledge_base/info';
import Collapsible from 'react-collapsible';

@connect((store) => {
  return {
    language: store.lang.language,
  }
})
class AnswerListElements extends Component {

  constructor(props) {
    super(props);
  }

  onChange(){

  }

  render() {
    if (this.props.loaded == false) {

      this.props.dispatch(info(this.props.index));
    }
    var label = this.props.information.label;
    var image = this.props.information.image;
    var lat = this.props.information.lat;
    var abstract = this.props.information.abstract;
    var video = this.props.information.youtube;
    var webpage = this.props.information.webpage;
    console.log("VIDEO");
    console.log(video);

    var left = {label: null, abstract: null, map: null, youtube: null};
    if (label != null) {
      left.label = (
        <div className={s.title}><p>{this.props.information.label}</p><LinksBar links={this.props.information.links}/>
        </div>)
    }
    if (abstract != null) {
      left.abstract = (<Label>{this.props.information.abstract}</Label>)
    }
    const options_video = {
      height: '390',
      width: '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    };
    if (video != null) {
      left.youtube = (<YouTube videoId={this.props.information.youtube} opts={options_video} id={this.props.index}/>)
    }

    if (lat != null) {
      left.map = (<MapBox mapid={"map" + this.props.index} lat={this.props.information.lat}
                          long={this.props.information.long}></MapBox>)
    }

    if (webpage != null) {
      left.webpage = <iframe src={webpage}/>
    }

    var right = {image: null, box: null};
    if (image != null) {
      right.image = (<ImageComponent key={"image" + this.props.index} image={image}></ImageComponent>)
    }
    if (this.props.information.kb == "dbpedia" || this.props.information.kb == "wikidata" || this.props.information.kb == "dblp" || this.props.information.kb == "musicbrainz" || this.props.information.kb == "freebase") {
      right.topk = (<TopK sumid={"sumbox" + this.props.index} uri={this.props.information.uri} topK={5}
                          lang={this.props.language[0]} kb={this.props.information.kb}/> )
    }

    //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");

      return (
        <div className={s.container}>
          {(this.props.loaded == true) ?
            <Condition>

              <Case test={this.props.information.literal != null}>
                <Label type="title">{this.props.information.literal}</Label>
              </Case>

              <Case test={label != null}>
                <Collapsible trigger={left.label}>
                  <div className={s.leftColumn}>
                    {left.abstract}
                    {left.map}
                    {left.youtube}
                    {left.webpage}
                  </div>
                  <div className={s.rightColumn}>
                    {right.image}
                    {right.topk}
                  </div>
                </Collapsible>


              </Case>
              <Case test={label == null && image != null}>

                {right.image}
              </Case>


            </Condition>
            : null}
        </div>)




    }


}

export default withStyles(AnswerListElements, s);
