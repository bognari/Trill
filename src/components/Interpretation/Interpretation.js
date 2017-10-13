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
import {sparqlToUser} from '../../actions/sparqlToUser';

@connect((store) => {
  return {
    sparqlInterpretationloading : store.qa.sparqlInterpretationloading,
    sparqlInterpretationloaded : store.qa.sparqlInterpretationloaded,
    SPARQLquery: store.qa.SPARQLquery,
  }
})
class Sparql extends Component {

  static PropTypes= {

  };

  render() {
    if (this.props.sparqlInterpretationloading[this.props.index]==false){
      this.props.dispatch(sparqlToUser(this.props.index));
    }
    return (
      <div className={s.container}>
        { (this.props.sparqlInterpretationloaded[this.props.index]==true) ?
        <div>
          {this.props.SPARQLquery[this.props.index].interpretation}
        </div>
          : null}
      </div>
    );
  }

}


export default withStyles(Sparql, s);
