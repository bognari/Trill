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
import s from './Feedback.scss';
import $ from 'jquery';
import Label from '../Label';

class Feedback extends Component {

  static propTypes = {
    question: PropTypes.string.isRequired,
    sparql: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
    };
  }

  componentDidMount() {
    document.querySelector('#button').onclick = function(){
      if(document.querySelector('#container').style.display == "none"){
        document.querySelector('#container').style = "display: block";
      }
      else {
        document.querySelector('#container').style = "display: none";
      }
    }

    document.querySelector('#submit').onclick = function(){
      var feedbackreq = $.post('http://wdaqua-qanary.univ-st-etienne.fr/feedback', $('#form').serialize(), function(data) {

        // this.setState({
        //   submitted: true,
        // })

        document.querySelector('#form').style = "display: none";
        document.querySelector('#thanks').style = "display: block";

      }.bind(this));
    }
  }

  render() {

    return (
      <div>
        <div id="button" className={s.button}>Feedback</div>

        <div id="container" className={s.container}>
        <div id="thanks" className={s.thanks}><Label>Thanks for your feedback!</Label></div>

        <form id="form" className={s.form} action="" method="POST">
            <input type="hidden" id="question" name="question" value={this.props.question}/>
            <input type="hidden" id="sparql" name="sparql" value={this.props.sparql}/>
            <p>How did we do? Was the result correct? &nbsp;&nbsp;
              <input type="radio" name="correct" value="true"/> Yes &nbsp;&nbsp;
              <input type="radio" name="correct" value="false"/>  No
            </p>
            <p>Comments: &nbsp;&nbsp; <input type="text" name="feedback" size="20" required/>
              &nbsp;&nbsp; <button id="submit" type="button">Submit</button>
            </p>
          </form>
          </div>
      </div>
    );
  }

}
export default withStyles(Feedback, s);
