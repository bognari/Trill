/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Field } from 'react-redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './QueryBox.scss';
import Location from '../../core/Location';
import {startQuestionAnsweringWithTextQuestion, startQuestionAnsweringWithAudioQuestion} from '../../actions/queryBackend';
import {setQuestion} from '../../actions/language';

@connect((store) => {
  return {
    question: store.qa.question,
    language: store.lang.language,
    knowledgebase: store.knowledgebase.knowledgebase,
  }
})
class QueryBox extends Component {

  static propTypes = {
    size: PropTypes.string.isRequired,
    header: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      voicequery: "", //indicates the query given by voice recording if any
      audio: false, //if the user is using audio feature to give question
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleÍnput = this.handleÍnput.bind(this);
  }

  componentDidMount() {

    var MediaStreamRecorder = require('msr');
    var mediaRecorder;
    var stopevent;

    document.querySelector('#record').onclick = function(){
      console.log('Recording started');

      var getUserMedia = navigator.mediaDevices.getUserMedia;

      //Get permission from browser to use microphone
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
          console.log('Permission granted');

          document.querySelector('#record').style = "display: none";
          document.querySelector('#querytext').style = "display: none";
          document.querySelector('#go').style = "display: none";
          document.querySelector('#listening').style = "display: inline-block";
          document.querySelector('#stop').style = "display: inline-block";
          document.querySelector('#cancel').style = "display: inline-block";

          mediaRecorder = new MediaStreamRecorder(stream);
          mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
          mediaRecorder.audioChannels = 1;
          mediaRecorder.sampleRate = 44100;

          mediaRecorder.start(60000); //maximum length should be a 60s recording

          mediaRecorder.ondataavailable = function (blob) {
            processStop(blob, stream, this);
          }.bind(this);
        }.bind(this))
        .catch(function(error) {
          console.log('Error: ' + error);
        })
    }.bind(this)

    document.querySelector('#stop').onclick = function(){
      console.log('Stop clicked');
      stopevent = null;
      mediaRecorder.stop();
      document.querySelector('#record').style = "display: inline-block";
      document.querySelector('#querytext').style = "display: inline-block";
      document.querySelector('#go').style = "display: inline-block";
      document.querySelector('#listening').style = "display: none";
      document.querySelector('#stop').style = "display: none";
      document.querySelector('#cancel').style = "display: none";
    }

    document.querySelector('#cancel').onclick = function(e){
      stopevent = e;
      mediaRecorder.stop();
      mediaRecorder = null;
      document.querySelector('#record').style = "display: inline-block";
      document.querySelector('#querytext').style = "display: inline-block";
      document.querySelector('#go').style = "display: inline-block";
      document.querySelector('#listening').style = "display: none";
      document.querySelector('#stop').style = "display: none";
      document.querySelector('#cancel').style = "display: none";

    }

    function processStop(blob, stream, comp){
      stream.stop();//stop capturing
      console.log("Capturing stopped.");

      if(stopevent == null){//check if cancel was used to stop the recorder. If not, then proceed
      // POST/PUT "Blob" using FormData/XHR2
      var blobURL = URL.createObjectURL(blob);
      console.log("Wav url: ", blobURL);

      var arrayBuffer;
      var fileReader = new FileReader();

      var that=comp;
      fileReader.onload = function() {
        arrayBuffer = this.result;
        //console.log('onload reached, arraybuf:', arrayBuffer);

        var buffer = new Int16Array(arrayBuffer);
        console.log('Int16array: ', buffer);

        var mp3encoder = new lamejs.Mp3Encoder(1, 44100, 128); //mono 44.1khz (samplerate) encode to 128kbps
        var mp3Tmp = mp3encoder.encodeBuffer(buffer); //encode mp3
        var mp3Data = [];

        //Push encode buffer to mp3Data variable
        mp3Data.push(mp3Tmp);

        // Get end part of mp3
        mp3Tmp = mp3encoder.flush();

        var mpblob = new Blob(mp3Data, {type: 'audio/mp3'});
        var url = URL.createObjectURL(mpblob);
        console.log('MP3 URl: ', url);
        //console.log(mpblob);

        // var mparrayBuffer;
        // var mpfileReader = new FileReader();

        // mpfileReader.onload = function() {
        //   mparrayBuffer = this.result;
        //   console.log('mp onload reached, arraybuf:', mparrayBuffer);
        //
        //   var mpbuffer = new Int16Array(mparrayBuffer);
        //   console.log('mp is it same????......int16array: ', mpbuffer);

        //from here is a test to understand the audio service

        var mpfile = new File([mpblob], "recording.mp3");
        that.props.dispatch(startQuestionAnsweringWithAudioQuestion(mpfile));
        Location.push("/question");
      }
      fileReader.readAsArrayBuffer(blob);
    }
    }


    document.querySelector('#record').className = s.hide;

    //Hacks to determine the browser, mik working only for firefox and chrome
    if (typeof window !== 'undefined') {
      if (typeof window.chrome !== 'undefined') {
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        if (isChrome){
          document.querySelector('#record').className = (this.props.header == true)? s.headerbutton : s.button;
        }
      }
    }
    var isFirefox = typeof InstallTrigger !== 'undefined';
    if (isFirefox){
      document.querySelector('#record').className = (this.props.header == true)? s.headerbutton : s.button;
    }
  }

  componentDidUpdate() {
    document.querySelector("#querytext").defaultValue = (this.props.question != undefined) ? this.props.question : "";

    //to hide the mic when the language is not set to english
    if(this.props.language != "en"){
       document.querySelector('#record').className = s.hide;
    }
    else {
       document.querySelector('#record').className = (this.props.header == true)? s.headerbutton : s.button;
    }
  }

  handleClose() {
    this.forceUpdate();
    document.getElementById('querybox').reset();
  }

  handleSubmit(e){
    e.preventDefault();
    //this.props.dispatch({type: URI_INPUT, uriInput: false});//in case there was an audio file already performed, we need to empty it
    this.props.dispatch(startQuestionAnsweringWithTextQuestion(document.querySelector("#querytext").value, this.props.language, this.props.knowledgebase));
    Location.push("/question?query="+document.querySelector("#querytext").value+"&lang="+this.props.language);
  }

  handleÍnput(e){
    //this.props.dispatch(setQuestion(e.target.value));
    //Location.push("/question?query="+e.target.value);
  }

  render() {
    var placeholder = {
      en: "Enter your question... ",
      de: "Gebe eine Frage ein ... ",
      fr: "Entrez une question ... ",
      it: "Fammi una domanda ... ",
    };

    var go = {
      en: "Go",
      de: "Los",
      fr: "Go",
      it: "Vai",
    }
    return (
      <form id="querybox" action="/question"  method="GET" autoComplete="on" className={s.querybox} onSubmit={this.handleSubmit}>
            {/*{(this.state.audio) ?*/}
              <div>
                <div id="listening" className={s.listening}><p>Listening... </p></div>
                <button id="stop" type="button" className={s.stop}>Done</button>
                {/*<a id="cancel" href={Location.createHref("/")} className={s.cancel}>x</a>*/}
                <button id="cancel" className={s.cancel}>x</button>
              </div>
              {/*:*/}
              <div className={s.queryform}>
                <input id="querytext" type="text" name="query" className={(this.props.header == true)? s.headertextinput : s.textinput} placeholder={placeholder[this.props.language]} required autoFocus size={this.props.size} onChange={this.handleÍnput} defaultValue={this.props.question}/>
                <button id="record" type="button" className={s.hide}><img src={require('./Mic2.png')} alt="" height="15px" className={s.mic}/></button>
                {/*{(mic==true) ? <button id="record" type="button" className={s.space}><img src={require('./Mic2.png')} alt="" height="15px" className={s.mic}/></button> : <div id="record" style={{display: "inline-block"}}></div> }*/}
                <input id="go" type="submit" className={(this.props.header == true)? s.headerbutton : s.button} value={go[this.props.language]}/>
              </div>
            {/*}*/}
        </form>
    );
  }
}

export default withStyles(QueryBox, s);
