/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HomePage.scss';
import QueryBox from '../QueryBox';
import AnswerPage from '../AnswerPage';

const title = 'WDAqua';

class HomePage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  static propTypes = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className={s.container}>
          <img src={require('./../../public/WDAquaLogo.png')} height="96" alt="WDAqua" className={s.logo}/>
          <QueryBox size="70"/>
        </div>
      </div>
    );
  }

}
export default withStyles(HomePage, s);
