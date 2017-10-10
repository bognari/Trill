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
    kb: store.knowledgebase.knowledgebase,
  }
})

class Suggestions extends Component {

  shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
  }

  return array;
}

  render() {

    var list = samplequestions;


    return (
      <div className={s.root}>
        <div className={s.container}>
          <ul>
            {this.shuffle(list[0].list).map(function (samplequestion, index) {
              if (samplequestion.lang==this.props.language && this.props.kb.includes(samplequestion.kb)) {
                var link = "/question?query=" + encodeURI(samplequestion.question) + "&lang=" + this.props.language +"&kb=" + this.props.kb.join(',') ;
                return (<li key={index} className={s.li}>
                  <Link className={n.darklink}
                        to={link}>{samplequestion.question}</Link>
                </li>);
              }
            }.bind(this))}
          </ul>
        </div>
      </div>
    );
  }

}

export default withStyles(Suggestions, s, n);

