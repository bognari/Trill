/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.scss';
import Link from '../Link';

@connect((store) => {
  return {
    language: store.lang.language,
  }
})
class Footer extends Component {



  render() {

    var issue = {
      en: "Report an issue",
      de: "Fehler Melden",
      fr: "Signaler une erreur",
      it: "Segnalare un errore",
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          <a href="http://laboratoirehubertcurien.univ-st-etienne.fr/"><img src={require("./logo_lab.png")}/></a>
          <span className={s.spacer}>·</span>
          <Link className={s.link} to="/">Home</Link>
          <span className={s.spacer}>·</span>
          <a
            className={s.link}
            href="https://github.com/WDAqua/frontEnd/issues/new"
          >{issue[this.props.language]}</a>
        </div>
      </div>
    );
  }

}

export default withStyles(Footer, s);
