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
import s from './Sparql.scss';

class Sparql extends Component {

  static propTypes = {
    sparqlquery: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      query: false, //indicates if the answer or the query is displayed
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({query: !this.state.query}); //on click switch from query to answer
  }

  render() {
    return (
      <div className={s.container}>
        <div id="q" onClick={this.handleClick} className={(this.state.query) ? s.sparqlpressed : s.sparql}>
          Q
        </div>
        {(this.state.query) ? <div className={s.qbox}><p>{this.props.sparqlquery}</p></div> : null}
    </div>
    );
  }

}
export default withStyles(Sparql, s);
