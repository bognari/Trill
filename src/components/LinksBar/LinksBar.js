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
        {this.props.links.hasOwnProperty("wikipedia") == true ? <a target="_blank" href={this.props.links.wikipedia}><img src={require('./images/wikipedia-logo.png')} height="30" alt="wikipedia" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("dbpedia") == true ? <a target="_blank" href={this.props.links.dbpedia}><img src={require('../../actions/knowledge_base/implemented/images/dbpedia_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("wikidata") == true ? <a target="_blank" href={this.props.links.wikidata}><img src={require('../../actions/knowledge_base/implemented/images/wikidata_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("musicbrainz") == true ? <a target="_blank" href={this.props.links.musicbrainz}><img src={require('../../actions/knowledge_base/implemented/images/musicbrainz_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("biennale") == true ? <a target="_blank" href={this.props.links.biennale}><img src={require('../../actions/knowledge_base/implemented/images/biennale_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("dblp") == true ? <a target="_blank" href={this.props.links.dblp}><img src={require('../../actions/knowledge_base/implemented/images/dblp_logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
      </div>
    );
  }

}
export default withStyles(LinksBar, s);
