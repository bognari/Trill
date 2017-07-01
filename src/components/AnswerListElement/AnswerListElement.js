/**
 * Trill (http://www.wdaqua.eu/)
 *
 * Copyright © 2014-2017 University Jean Monet, All rights reserved.
 *
 */

import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux'

import ImageComponent from '../ImageComponent'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AnswerListElement.scss';
import Label from '../Label';
import Loader from 'react-loader';
import MapBox from '../MapBox';
import TopK from '../TopK';
import LinksBar from '../LinksBar';
import {info} from '../../actions/knowledge_base/info';

@connect((store) => {
  return {}
})
class AnswerListElement extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
      this.props.dispatch(info(this.props.index));
  }

  render() {
    console.log(this.props.information);
    var loaded = false;
    if (this.props.information!=null){
      loaded = true;
    }
    return (
      <div className={s.container}>

        <Loader loaded={loaded} color="#333">
          <div>
            {(info.answertype == "simple") ? <Label type="title">{info.label}</Label> : null}  
            {(info.answertype == "noinfo") ?    <a href={info.link} className={s.link}><Label type="title">{info.label}</Label></a> : null}  
            {(info.answertype == "detail") ?    <div className={s.leftColumn}>      <div className={s.title}><p>{info.label}</p>        <LinksBar wikipedia={info.link} uri={info.uri} /></div>      {(info.abstract != "") ? <Label>{info.abstract}</Label> : null}    </div> : null} 
            {(info.answertype == "map") ?    <div className={s.leftColumn}>      <div className={s.title}><p>{info.label}</p>        <LinksBar wikipedia={info.link} uri={info.uri} /></div>      {(info.abstract != "") ? <Label>{info.abstract}</Label> : null}      <MapBox mapid={"map" + info.key} lat={info.lat} long={info.long}></MapBox>    </div> : null}  
            {(info.answertype == "detail" || info.answertype == "map") ?    <div className={s.rightColumn}>      {(info.image != "") ?        <ImageComponent key={"image" + info.key} image={info.image}></ImageComponent> : null}      <TopK sumid={"sumbox" + info.key} uri={info.uri} topK={5} lang={this.props.language}/>    </div> : null}
          </div>
        </Loader>
      </div>
    )
  }


}
export default withStyles(AnswerListElement, s);
