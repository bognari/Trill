/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BiennaleNav.scss';
import {connect} from 'react-redux';
import n from '../Navigation/Navigation.scss';
import Link from '../Link';
import {questionansweringfull} from '../../actions/qanary';

@connect((store) => {
  return {
    knowledgebase: store.knowledgebase.knowledgebase,
    language: store.lang.language,
  }
})

class BiennaleNav extends Component {

  render() {

    var artwork = {
      en: "Artworks",
      de: "",
      fr: "Oeuvres",
      it: "",
    };

    var artworkquery = {
      en: "Design%20with%20heart%20exhibition%20art&lang=en&kb=biennale",
      de: "",
      fr: "",
      it: "",
    };

    var artist = {
      en: "Artists",
      de: "",
      fr: "Artistes",
      it: "",
    };

    var artistquery = {
      en: "design%20with%20heart%20exhibition%20artists&lang=en&kb=biennale",
      de: "",
      fr: "",
      it: "",
    };

    return (
      <div className={s.root}>
        <div className={s.container}>
          <Link className={n.accentlink} to={"/question?query=" + artworkquery[this.props.language]}>{artwork[this.props.language]}</Link>
          <Link className={n.accentlink} to={"/question?query=" + artistquery[this.props.language]}>{artist[this.props.language]}</Link>
        </div>
      </div>
    );
  }

}

export default withStyles(BiennaleNav, s, n);

