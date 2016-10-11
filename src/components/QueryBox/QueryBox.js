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
import s from './QueryBox.scss';

class QueryBox extends Component {

  static propTypes = {
    size: PropTypes.string.isRequired,
    query: PropTypes.string,
  };

  constructor(props) {
    super(props);
    // this.state = {  querytext : "" };
  }

  componentDidMount() {
    var MediaStreamRecorder = require('msr');
    var mediaRecorder;

    document.querySelector('#record').onclick = function(){
      console.log('recording started');

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
          console.log('Permission granted');

          mediaRecorder = new MediaStreamRecorder(stream);
          mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav

          mediaRecorder.start(60000); //maximum length should be a 60s recording
          mediaRecorder.ondataavailable = function (blob) {
            // POST/PUT "Blob" using FormData/XHR2
            var blobURL = URL.createObjectURL(blob);
            //document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
            mediaRecorder.save();
          };

        })
        .catch(function(error) {
          console.log('Error: ' + error);
        })
    }

    document.querySelector('#stop').onclick = function(){
      console.log('now Stop clicked');
      mediaRecorder.stop();
    }
  }

  render() {

    return (
        <form action="/question" method="GET" autoComplete="on" className={s.querybox}>
          <div>
            <input type="text" name="query" placeholder="Enter your question..." required autoFocus size={this.props.size} defaultValue={this.props.query}/>
            <button id="record" type="button" className={s.space}>Test</button>
            <button id="stop" type="button" className={s.space}>Stop</button>
            <input type="submit" value="Go" className={s.space}/>
          </div>
        </form>
    );
  }

}
export default withStyles(QueryBox, s);
