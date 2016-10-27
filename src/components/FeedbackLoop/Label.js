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
import s from './Label.scss';

class Label extends Component {

  static propTypes = {
    message: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {

    return (
      <div>Hello World! {this.props.message}</div>
    );
  }

}
export default withStyles(Label, s);