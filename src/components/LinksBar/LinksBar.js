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

  render() {
    return (
      <div className={s.container}>
        {this.props.links.hasOwnProperty("homepage") == true ? <a target="_blank" href={this.props.links.homepage}><img src={require('./images/homepage.png')} height="30" alt="wikipedia" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("wikipedia") == true ? <a target="_blank" href={this.props.links.wikipedia}><img src={require('./images/wikipedia-logo.png')} height="30" alt="wikipedia" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("dbpedia") == true ? <a target="_blank" href={this.props.links.dbpedia}><img src={require('../../actions/knowledge_base/implemented/images/dbpedia_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("wikidata") == true ? <a target="_blank" href={this.props.links.wikidata}><img src={require('../../actions/knowledge_base/implemented/images/wikidata_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("musicbrainz") == true ? <a target="_blank" href={this.props.links.musicbrainz}><img src={require('../../actions/knowledge_base/implemented/images/musicbrainz_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("dblp") == true ? <a target="_blank" href={this.props.links.dblp}><img src={require('../../actions/knowledge_base/implemented/images/dblp_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("biennale") == true ? <a target="_blank" href={this.props.links.biennale}><img src={require('../../actions/knowledge_base/implemented/images/biennale_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("freebase") == true ? <a target="_blank" href={this.props.links.freebase}><img src={require('../../actions/knowledge_base/implemented/images/freebase_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("scigraph") == true ? <a target="_blank" href={this.props.links.scigraph}><img src={require('../../actions/knowledge_base/implemented/images/scigraph_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("doi") == true ? <a target="_blank" href={this.props.links.doi}><img src={require('./images/doi-logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("facebook") == true ? <a target="_blank" href={this.props.links.facebook}><img src={require('./images/facebook.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("github") == true ? <a target="_blank" href={this.props.links.github}><img src={require('./images/github.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("twitter") == true ? <a target="_blank" href={this.props.links.twitter}><img src={require('./images/twitter.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("instagram") == true ? <a target="_blank" href={this.props.links.instagram}><img src={require('./images/instagram.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("orcid") == true ? <a target="_blank" href={this.props.links.orcid}><img src={require('./images/orcid.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
      </div>
    );
  }

}
export default withStyles(LinksBar, s);
