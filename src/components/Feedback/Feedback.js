/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react'
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
      feedbackbox: false, //if the feedback button has been pressed
      submitted: false,
      error: false, //if there was an error sending feedback to server
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {//not used right now, wil be used once there is a need for collapsing the feedback box
    this.setState({feedbackbox: !this.state.feedbackbox}); //on click switch feedbackbox displayed or not
  }

  handleChange() {
    var feedbackreq = $.post('http://wdaqua-qanary.univ-st-etienne.fr/feedback', $('#form').serialize(), function(data) {
      this.setState({submitted: !this.state.submitted}); //if feedback was submitted successfully
      document.querySelector('#holder').className = s.hide; //animate hiding
      setTimeout(function(){
        document.querySelector('#holder').style = "display: none"; //finally, hide
      }, 1800)
    }.bind(this));

    feedbackreq.fail(function(e) {
      this.setState({error: !this.state.error});
    }.bind(this));
  }

  render() {
    return (
      <div id="holder">
        {/*<div id="button" onClick={this.handleClick} className={(this.state.feedbackbox) ? s.buttonpressed : s.button}>Feedback</div>*/}

        <div id="container" className={s.container}>
          {(this.state.submitted && !this.state.error) ? <p>Thanks for your feedback!</p> :
            <form id="form" className={s.form} action="" method="POST">
              <input type="hidden" id="question" name="question" value={this.props.question}/>
              <input type="hidden" id="sparql" name="sparql" value={this.props.sparql}/>
              <p>Is this the right answer? &nbsp;&nbsp;
                <input type="radio" name="correct" value="true" onChange={this.handleChange}/> Yes &nbsp;&nbsp;
                <input type="radio" name="correct" value="false" onChange={this.handleChange}/>  No
              </p>
            </form>
          }
          {(this.state.error) ? <p>Sorry, there was an error.</p> : null}

          </div>
      </div>
    );
  }

}
export default withStyles(Feedback, s);
