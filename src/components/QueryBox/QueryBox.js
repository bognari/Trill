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

// function queryTextChange(e){
//   this.setState({querytext: e.target.value});
// }


class QueryBox extends Component {

  static propTypes = {
    size: PropTypes.string.isRequired,
    query: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    // this.state = {  querytext : "" };
  }

  // _handleChange = (event) => this.setState({querytext: e.target.value});

  handleClick() {
    console.log('how another test print');

    // window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
    // var audio_context = new AudioContext();
    //
    // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    // navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    //   console.log('No live audio input: ' + e);
    // });
    //
    // function startUserMedia(stream) {
    //   // create MediaStreamSource and GainNode
    //   var input = audio_context.createMediaStreamSource(stream);
    //   var volume = audio_context.createGain();
    //   volume.gain.value = 0.7;
    //
    //   // connect them and pipe output
    //   input.connect(volume);
    //   volume.connect(audio_context.destination);
    //
    //   // connect recorder as well - see below
    //   var recorder = new Recorder(input);
    // }

    //=======

    // var handleSuccess = function(stream) {
    //   // Attach the video stream to the video element and autoplay.
    //   console.log("successfuly recorded");
    //   //player.src = URL.createObjectURL(stream);
    // };
    //
    // navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    //   .then(handleSuccess);

    //========

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        console.log('Permission granted');
        var MediaStreamRecorder = require('msr');

        var mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav

        mediaRecorder.start(5000);
        setTimeout(function(){ mediaRecorder.stop() }, 5000);
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

  };


  render() {

    return (
        <form action="/question" method="GET" autoComplete="on" className={s.querybox}>
          <div>
            <input type="text" name="query" placeholder="Enter your question..." required autoFocus size={this.props.size} defaultValue={this.props.query}/>
            <button type="button" className={s.space} onClick={this.handleClick}>Test</button>
            <input type="submit" value="Go" className={s.space}/>
          </div>
        </form>
    );
  }

}
export default withStyles(QueryBox, s);
