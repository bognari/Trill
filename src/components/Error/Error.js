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
import s from './Error.scss';

class Error extends Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {

    return (
      <div className={s.center}>
        <h1>{this.props.children}</h1>
        <p>Sorry, a critical error occurred.</p>
      </div>
    );
  }

}
export default withStyles(Error, s);
