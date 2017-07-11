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
        {this.props.links.hasOwnProperty("dbpedia") == true ? <a target="_blank" href={this.props.links.dbpedia}><img src={require('./images/dbpedia-logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("wikidata") == true ? <a target="_blank" href={this.props.links.wikidata}><img src={require('./images/wikidata-logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
        {this.props.links.hasOwnProperty("musicbrainz") == true ? <a target="_blank" href={this.props.links.musicbrainz}><img src={require('./images/musicbrainz-logo.png')} height="30" alt="resource" className={s.imglink}/></a> : null}
      </div>
    );
  }

}
export default withStyles(LinksBar, s);
