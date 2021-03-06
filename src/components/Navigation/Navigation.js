/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.scss';
import Link from '../Link';
import SelectorLanguageFlags from '../SelectorLanguageFlags';
import SelectorKnowledgeBase from '../SelectorKnowledgeBase';

@connect((store) => {
  return {
    language: store.lang.language,
  }
})
class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string,
    linkClassName: PropTypes.string,
  };

  render() {
    var about = {
      en: "About",
      de: "Über uns",
      fr: "Sur nous",
      it: "Su di noi",
      es: "Sobre nosotros",
    };

    var faq = {
      en: "FAQ",
      de: "FAQ",
      fr: "FAQ",
      it: "FAQ",
      es: "FAQ",
    };

    var example = {
      en: "Examples",
      de: "Beispiele",
      fr: "Examples",
      it: "Esempi",
      es: "Ejemplos",
    };

    return (
      <div className={cx(s.root, this.props.className)} role="navigation">
        <Link className={cx(s.center, this.props.linkClassName)} to={"/about_"+this.props.language}>{about[this.props.language]}</Link>
        <Link className={cx(s.center, this.props.linkClassName)} to="/faq">{faq[this.props.language]}</Link>
        {/*<Link className={this.props.linkClassName} to={"/examples_en"}>{example[this.props.language]}</Link>*/}
        <div className={s.flags}> <SelectorKnowledgeBase/></div>
        <div className={s.flags}> <SelectorLanguageFlags/></div>
      </div>
    );
  }

}

export default withStyles(Navigation, s);
