/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Suggestions.scss';
import {connect} from 'react-redux';
import n from '../Navigation/Navigation.scss';
import Link from '../Link';
import biennalequestions from './SampleQuestions/biennale_en.json';
import biennalequestions_fr from './SampleQuestions/biennale_fr.json';
import samplequestions from './SampleQuestions/questions_en.json';

@connect((store) => {
  return {
    language: store.lang.language,
    knowledgebase: store.knowledgebase.knowledgebase,
  }
})

class Suggestions extends Component {

  render() {

    var list;

    //to update how language is selected
    if(this.props.knowledgebase == "biennale"){
      switch(this.props.language) {
        case "en":
          list = biennalequestions;
          break;
        case "fr":
          list = biennalequestions_fr;
          break;
      }
    }
    else {
      list = samplequestions;
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          <ul>
            {list[0].list.map(function (samplequestion) {
              return (<li>
                <Link className={n.darklink} to={"/question?" + samplequestion.queryparams}>{samplequestion.question}</Link>
              </li>);
            })}
          </ul>
        </div>
      </div>
    );
  }

}

export default withStyles(Suggestions, s, n);

