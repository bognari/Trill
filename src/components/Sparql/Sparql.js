/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Sparql.scss';
import {questionanswering} from '../../actions/queryBackend';

@connect((store) => {
  return {
    SPARQLquery: store.qa.SPARQLquery,
    namedGraph: store.qa.namedGraph,
  }
})
class Sparql extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {
      query: false, //indicates if the answer or the query is displayed
      selectedQuery: false,
    };
    this.handleClick = this.handleClick.bind(this);
    }

  static contextTypes = {
    owner: PropTypes.element,
  }

  handleClick() {
    this.setState({query: !this.state.query}); //on click switch from query to answer
    document.querySelector("#q0").style="background-color: #f5f5f5";
    }

  render() {
    return (
      <div className={s.container}>
        <div className={s.wrapfloat}>
        <div id="q" onClick={this.handleClick} className={(this.state.query) ? s.sparqlpressed : s.sparql}>
          Q
        </div>
        </div>
              {(this.state.query) ?
                <div id="FiringSparql" className={s.qbox}>
                  {/*{this.props.sparqlquery.map(function (newitems, index) {*/}
                    {/*return (*/}
                      {/*<p id={"q"+index}>*/}
                      {/*<input type="radio" className={s.sparqlmenu} name = "selectquery" value = {newitems.query} onClick={this.handleClick2.bind(this, newitems.query,index)}>&nbsp; &nbsp; {newitems.query} </input>*/}
                      {/*</p>)*/}
                        {/*}.bind(this))*/}
                  {/*}*/}
                  <p id="q">
                    {this.props.sparqlquery[0].query}
                  </p>
                </div>: null
              }
      </div>
    );
  }

}
export default withStyles(Sparql, s);
