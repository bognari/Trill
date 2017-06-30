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
import {sparqlToUserEndpoint} from '../../config';
import {wikidata_endpoint} from '../../config';
import {dbpedia_endpoint} from '../../config';

@connect((store) => {
  return {
    lang: store.lang.language,
    kb: store.knowledgebase.knowledgebase,

  }
})
class Sparql extends Component {

  static PropTypes= {

  };

  constructor(props) {
    super(props);
    this.state = {
      retrived: false,
      interpretation: "",
      lang:"",
      kb:"",
      endpoint:"",
    };
  }

  call(query){
    this.serverRequest = $.ajax({
      url: sparqlToUserEndpoint,
      type: "POST",
      contentType: 'application/x-www-form-urlencoded',
      data: { sparql: query, lang: this.props.lang, kb: this.props.kb},//, endpoint: this.props.kb ="wikidata" ? wikidata_endpoint : dbpedia_endpoint  },
      success: function (result) {
        var res = result.interpretation;
        var lan = result.lang;
        var knbs = result.kb;
        console.log("This is your KB: ",knbs);

        this.setState({ retrived: true, interpretation: res} );
      }.bind(this),
      error: function(err){
        console.log(err)
      }
    })
  }
  componentDidMount() {

    this.call(this.props.sparqlquery.query);

  }


  componentWillReceiveProps(nextProps) {

    this.call(nextProps.sparqlquery.query);
  }



  render() {

    return (

      <div className={s.container}>
        <div className={s.wrapfloat}>
        </div>
        {(this.state.retrived) ?
          <div id="FiringSparql" className={s.qbox}>
            <p id="q">
              {this.state.interpretation}
            </p>
          </div>: null
        }
      </div>
    );
  }

}


export default withStyles(Sparql, s);
