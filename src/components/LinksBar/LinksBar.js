/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LinksBar.scss';
import {connect} from 'react-redux'


class LinksBar extends Component {

  static propTypes = {
    links: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  homepage(e){
    window.open(this.props.links.homepage);
    e.stopPropagation();
  }

  wikipedia(e){
    window.open(this.props.links.wikipedia);
    e.stopPropagation();
  }

  dbpedia(e){
    window.open(this.props.links.dbpedia);
    e.stopPropagation();
  }

  wikidata(e){
    window.open(this.props.links.wikidata);
    e.stopPropagation();
  }

  musicbrainz(e){
    window.open(this.props.links.wikidata);
    e.stopPropagation();
  }

  dblp(e){
    window.open(this.props.links.dblp);
    e.stopPropagation();
  }

  biennale(e){
    window.open(this.props.links.biennale);
    e.stopPropagation();
  }

  freebase(e){
    window.open(this.props.links.freebase);
    e.stopPropagation();
  }

  doi(e){
    window.open(this.props.links.doi);
    e.stopPropagation();
  }

  facebook(e){
    window.open(this.props.links.facebook);
    e.stopPropagation();
  }

  github(e){
    window.open(this.props.links.github);
    e.stopPropagation();
  }

  twitter(e){
    window.open(this.props.links.twitter);
    e.stopPropagation();
  }

  instagram(e){
    window.open(this.props.links.instagram);
    e.stopPropagation();
  }

  orcid(e){
    window.open(this.props.links.orcid);
    e.stopPropagation();
  }

  openstreetmap(e){
    window.open(this.props.links.openstreetmap);
    e.stopPropagation();
  }




  render() {
    return (
      <div className={s.container}>
        {this.props.links.hasOwnProperty("homepage") == true ? <a href="" onClick={this.homepage.bind(this)}><img src={require('./images/homepage.png')} height="30" alt="wikipedia" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("wikipedia") == true ? <a href="" onClick={this.wikipedia.bind(this)}><img src={require('./images/wikipedia-logo.png')} height="30" alt="wikipedia" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("dbpedia") == true ? <a href="" onClick={this.dbpedia.bind(this)}><img src={require('../../actions/knowledge_base/implemented/images/dbpedia_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("wikidata") == true ? <a href="" onClick={this.wikidata.bind(this)}><img  src={require('../../actions/knowledge_base/implemented/images/wikidata_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("musicbrainz") == true ? <a href="" onClick={this.musicbrainz.bind(this)}><img  src={require('../../actions/knowledge_base/implemented/images/musicbrainz_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("dblp") == true ? <a href="" onClick={this.dblp.bind(this)}><img  src={require('../../actions/knowledge_base/implemented/images/dblp_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("biennale") == true ? <a href="" onClick={this.biennale.bind(this)}><img src={require('../../actions/knowledge_base/implemented/images/biennale_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("freebase") == true ? <a href="" onClick={this.freebase.bind(this)}><img src={require('../../actions/knowledge_base/implemented/images/freebase_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("doi") == true ? <a href="" onClick={this.doi.bind(this)}><img  src={require('./images/doi-logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("facebook") == true ? <a href="" onClick={this.facebook.bind(this)}><img src={require('./images/facebook.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("github") == true ? <a href="" onClick={this.github.bind(this)}><img src={require('./images/github.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("twitter") == true ? <a href="" onClick={this.twitter.bind(this)}><img src={require('./images/twitter.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("instagram") == true ? <a href="" onClick={this.instagram.bind(this)}><img src={require('./images/instagram.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("orcid") == true ? <a href="" onClick={this.orcid.bind(this)}><img src={require('./images/orcid.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("openstreetmap") == true ? <a href="" onClick={this.openstreetmap.bind(this)}><img src={require('../../actions/knowledge_base/implemented/images/openstreetmap-logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
      </div>
    );
  }

}
export default withStyles(LinksBar, s);
