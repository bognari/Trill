/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import LanguageSelector from '../LanguageSelector';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import Navigation from '../Navigation';
import n from '../Navigation/Navigation.scss';

class Header extends Component {

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation className={s.nav} linkClassName={n.darklink} />
          <LanguageSelector />
          <div className={s.banner}>
          </div>
        </div>
      </div>
    );
  }

}

export default withStyles(Header, s, n);

