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
    sparqlInterpretationloaded : store.qa.sparqlInterpretationloaded,
    SPARQLquery: store.qa.SPARQLquery,
  }
})
class Sparql extends Component {

  static PropTypes= {

  };

  render() {
    console.log("INDEX>>>>>>>>>>>>>>>>>>>> ",this.props.index);
    console.log(this.props.sparqlInterpretationloaded[this.props.index]);
    if (this.props.sparqlInterpretationloaded[this.props.index]==false){
      this.props.dispatch(sparqlToUser(this.props.index));
    }
    console.log("loaded");
    console.log(this.props.SPARQLquery[this.props.index]);
    return (
      <div>
        { (this.props.sparqlInterpretationloaded[this.props.index]==true) ?
        <div className={s.container}>
          {this.props.SPARQLquery[this.props.index].interpretation}
        </div>
          : null}
      </div>
    );
  }

}


export default withStyles(Sparql, s);
