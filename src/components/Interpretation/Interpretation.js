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
import {questionanswering} from '../../actions/queryBackend';

@connect((store) => {
  return {
    SPARQLquery: store.qa.SPARQLquery,
    namedGraph: store.qa.namedGraph,
    language: store.lang.language,
    kbknowledgebase: store.knowledgebase.knowledgebase,
  }
})
class Sparql extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);
    this.state = {
    retrived: false,
    sparql: "",
    lang: "",
    kb: "",
    };
  }

  componentDidMount(selectedquery, index, e){
    this.serverRequest = $.ajax({
      url: "http://localhost:1920/sparqltouser",
      type: "POST",
      contentType: 'application/x-www-form-urlencoded',
      data: {sparql: this.props.sparqlquery[0].query, lang: this.props.language , kb: this.props.knowledgebase },
      success: function (result) {
            var res = result.s;
            var lan = result.lang;
            var knbs=result.kb;
            //alert(knbs);
           // console.log(result);
           // console.log(result);
            this.setState({retrived: true, sparql: res, lang: lan, kb: knbs});
      }.bind(this),
      error: function(err){
      console.log(err)
    }
    })
  }


  render() {
    return (
      <div className={s.container}>
        <div className={s.wrapfloat}>
        </div>
              {(this.state.retrived) ?
                <div id="FiringSparql" className={s.qbox}>
                 <p id="q">
                    {this.state.sparql}
                  </p>
                </div>: null
              }
      </div>
    );
  }

}
export default withStyles(Sparql, s);
