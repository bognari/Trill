/**
 * Trill (http://www.wdaqua.eu/)
 *
 * Copyright © 2014-2017 University Jean Monet, All rights reserved.
 *
 */

import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux'
import {Condition, Case} from 'react-case';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import ImageComponent from '../ImageComponent'
import s from './AnswerListElement.scss';
import Label from '../Label';
import MapBox from '../MapBox';
import TopK from '../TopK';
import LinksBar from '../LinksBar';
import {info} from '../../actions/knowledge_base/info';

@connect((store) => {
  return {
    language: store.lang.language,
  }
})
class AnswerListElement extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.loaded==false){
      this.props.dispatch(info(this.props.index));
    }
    var label = this.props.information.label;
    var image = this.props.information.image;
    var lat = this.props.information.lat;
    var abstract = this.props.information.abstract;

    var left = {label: null, abstract: null, map: null};
    if (label!=null) {
      left.label =  (<div className={s.title}><p>{this.props.information.label}</p><LinksBar links={this.props.information.links} /></div>)
    }
    if (abstract!=null) {
      left.abstract =  (<Label>{this.props.information.abstract}</Label>)
    }


    if (lat!= null){
      left.map = (<MapBox mapid={"map" + this.props.index} lat={this.props.information.lat} long={this.props.information.long}></MapBox>)
    }

    var right = {image: null, box: null};
    if (image!=null) {
      right.image =  (<ImageComponent key={"image" + this.props.index} image={image}></ImageComponent>)
    }
    if (this.props.information.kb == "dbpedia" || this.props.information.kb == "wikidata") {
      right.topk = (<TopK sumid={"sumbox" + this.props.index} uri={this.props.information.uri} topK={5}
                          lang={this.props.language}/>)
    }


    console.log("Label",this.props.information.literal);
    return (
      <div className={s.container}>
        { (this.props.loaded==true) ?
            <Condition>

              <Case test={this.props.information.literal!=null} >
                <Label type="title">{this.props.information.literal}</Label>
              </Case>

              <Case test={label!=null}>
                <div className={s.leftColumn}>
                  {left.label}
                  {left.abstract}
                  {left.map}
                </div>
                <div className={s.rightColumn}>
                  {right.image}
                  {right.topk}
                </div>
              </Case>


              <Case test={label==null && image!=null}>
                  {right.image}
              </Case>
            </Condition>
        : null}
      </div>
    )
  }
}
export default withStyles(AnswerListElement, s);
