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
import s from './LanguageSelector.scss';

import {setLanguage} from '../../actions/language';

@connect((store) => {
  return {
    language: store.lang.language,
  }
})
class LanguageSelector extends Component {

  handleChange(e){
    this.props.dispatch(setLanguage(e.target.value));
  }

  render() {
    console.log("Language: "+this.props.language);
    return (
        <div className={s.container}>
          <select
            value={this.props.language}
            onChange={this.handleChange.bind(this)} className={s.language}>
            <option value="en" defaultValue>English</option>
            <option value="fr">Francais</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
          </select>
        </div>
    );
  }
}

export default withStyles(LanguageSelector, s);

