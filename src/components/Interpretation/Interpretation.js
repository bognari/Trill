/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright Â© 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Interpretation.scss';


@connect((store) => {
  console.log(store);
  return {
    interpretation: store.sparqlToUser.interpretation,
    loaded: store.sparqlToUser.loaded,
  }
})
class Sparql extends Component {

  static propTypes = {};

  render() {
    return (
      <div className={s.container}>
        {(this.props.loaded) ?
           <p>
              {this.props.interpretation}
            </p> : null
        }
      </div>
    );
  }

}

export default withStyles(Sparql, s);
