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



@connect((store) => {
  return {
    kb: store.knowledgebase.knowledgebase,
  }
})
class LinksBar extends Component {

  static propTypes = {
    wikipedia: PropTypes.string,
    uri: PropTypes.string,
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    website: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    var knowledgeBases = {
      dbpedia: require('./images/dbpedia-logo.png'),
      wikidata: require('./images/wikidata-logo.png'),
      musicbrainz: require('./images/musicbrainz-logo.png'),
    };

    return (
      <div className={s.container}>
        {this.props.wikipedia != null ? <a href={this.props.wikipedia}><img src={require('./wikipedia-logo.png')} height="30" alt="wikipedia" className={s.imglink}/></a> : null}
        {this.props.uri != null ? <a href={this.props.uri}><img src={knowledgeBases[this.props.kb]} height="30" alt="resource" className={s.imglink}/></a> : null}
      </div>
    );
  }

}
export default withStyles(LinksBar, s);
