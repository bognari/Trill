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
import s from './Suggestions.scss';
import {connect} from 'react-redux';
import n from '../Navigation/Navigation.scss';
import Link from '../Link';

@connect((store) => {
  return {
    language: store.lang.language,
  }
})

class Suggestions extends Component {

  render() {

    var q1 = {
      en: "What country is Sinks from?",
      de: "",
      fr: "",
      it: "",
    };

    var q1query = {
      en: "design%20with%20heart%20exhibition%20artists&lang=en&kb=biennale",
      de: "",
      fr: "",
      it: "",
    };

    var q2 = {
      en: "Who is the artist of Basics?",
      de: "",
      fr: "",
      it: "",
    };

    var q2query = {
      en: "design%20with%20heart%20exhibition%20artists&lang=en&kb=biennale",
      de: "",
      fr: "",
      it: "",
    };

    return (
      <div className={s.root}>
        <div className={s.container}>
          <ul>
            <li>
          <Link className={n.darklink} to={"/question?query=" + q1query[this.props.language]}>{q1[this.props.language]}</Link>
            </li>
            <li>
          <Link className={n.darklink} to={"/question?query=" + q2query[this.props.language]}>{q2[this.props.language]}</Link>
            </li>
            <li>
              <Link className={n.darklink} to={"/question?query=" + q1query[this.props.language]}>{q1[this.props.language]}</Link>
            </li>
            <li>
              <Link className={n.darklink} to={"/question?query=" + q2query[this.props.language]}>{q2[this.props.language]}</Link>
            </li>
            <li>
              <Link className={n.darklink} to={"/question?query=" + q2query[this.props.language]}>Test question?</Link>
            </li>
            <li>
              <Link className={n.darklink} to={"/question?query=" + q2query[this.props.language]}>Test question?</Link>
            </li>
            <li>
              <Link className={n.darklink} to={"/question?query=" + q2query[this.props.language]}>Test question?</Link>
            </li>
            <li>
              <Link className={n.darklink} to={"/question?query=" + q2query[this.props.language]}>Test question?</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

}

export default withStyles(Suggestions, s, n);

