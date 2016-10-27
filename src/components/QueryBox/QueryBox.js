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
import Location from '../../core/Location';

class QueryBox extends Component {

  static propTypes = {
    size: PropTypes.string.isRequired,
    query: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      voicequery: "", //indicates the query given by voice recording if any
    };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.forceUpdate();
    document.getElementById('querybox').reset();
  }

  componentDidMount() {

    var MediaStreamRecorder = require('msr');
    var mediaRecorder;

    document.querySelector('#record').onclick = function(){
      console.log('recording started');

      //navigator.mediaDevices.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

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
            // POST/PUT "Blob" using FormData/XHR2
            var blobURL = URL.createObjectURL(blob);
            //document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
            console.log("Wav url: ", blobURL)
            //mediaRecorder.save();

            var arrayBuffer;
            var fileReader = new FileReader();

            fileReader.onload = function() {
              arrayBuffer = this.result;
              console.log('onload reached, arraybuf:', arrayBuffer);

              var buffer = new Int16Array(arrayBuffer);
              console.log('int16array: ', buffer);

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
              console.log(mpblob);

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

              var form  = new FormData();
              //form.append("question", mpblob); //this also works, but need to test if there is a difference to the service if we give blob or file
              form.append("question", mpfile, "recording.mp3");
              form.append("componentlist[]", ["SpeechRecognitionKaldi"]);

              //maybe should check if mpfile is proper

              console.log("mp3 file :", mpfile);
              console.log("Contents of form: ", form);

              var req = $.ajax({
                url: "http://wdaqua-qanary.univ-st-etienne.fr/startquestionansweringwithaudioquestion",
                data: form,
                processData: false,
                type: "POST",
                contentType: false,
                success: function (data) {

                  var sparqlQuery = "PREFIX qa: <http://www.wdaqua.eu/qa#> "
                    + "PREFIX oa: <http://www.w3.org/ns/openannotation/core/> "
                    + "SELECT ?sparql ?json "
                    + "FROM <"+  data.graph.toString() + "> "
                    + "WHERE { "
                    + "  ?a a qa:AnnotationOfAnswerSPARQL . "
                    + "  ?a oa:hasBody ?sparql . "
                    + "  ?b a qa:AnnotationOfAnswerJSON . "
                    + "  ?b oa:hasBody ?json ."
                    + "  ?c a qa:AnnotationOfTextRepresentation . "
                    + "  ?c oa:hasBody ?uriText "
                    + "}";

                  console.log('successful send to audio service');
                  console.log('This is the recieved data: ', data);
                  console.log('data graph: ', data.graph.toString());

                  this.serverRequest = $.ajax({
                    url: "http://wdaqua-endpoint.univ-st-etienne.fr/qanary/query?query=" + encodeURIComponent(sparqlQuery),
                    type: "GET",
                    beforeSend: function (xhr) {
                      xhr.setRequestHeader("Authorization", "Basic " + btoa("admin:admin"));
                      xhr.setRequestHeader('Accept', 'application/sparql-results+json');
                    },
                    success: function (result) {

                      console.log("result of second request: ", result);
                      var query = result.results.bindings[0].sparql.value;
                      var jresult = JSON.parse(result.results.bindings[0].json.value);

                      console.log('The audio json result is this: ', jresult);
                    }.bind(this)
                  });

                }.bind(this)
              });
              // var form = req.form();
              // form.append('question', mpfile, {
              //   filename: 'recording.mp3',
              //   contentType: 'audio/mp3'
              // });

              // }
              // mpfileReader.readAsArrayBuffer(mpblob);

             };

            fileReader.readAsArrayBuffer(blob);
          };
        })
        .catch(function(error) {
          console.log('Error: ' + error);
        })
    }

    document.querySelector('#stop').onclick = function(){
      console.log('Stop clicked');
      // this.setState({
      //   voicequery: "Capital+of+Canada",
      // });
      mediaRecorder.stop();

    }
  }

  render() {

    return (
        <form id="querybox" action="/question" method="GET" autoComplete="on" className={s.querybox}>
          <div>
            <input id="querytext" type="text" name="query" placeholder="Enter your question..." required autoFocus size={this.props.size} defaultValue={this.props.query}/>
            <div id="listening" className={s.listening}><p>Listening... </p></div>
            <button id="record" type="button" className={s.space}><img src={require('./Mic2.png')} alt="" height="15px" className={s.mic}/></button>
            {/*<a href={Location.createHref("/question?query=" + "Capital+of+Canada")}><button id="stop" type="button" className={s.stop}>Done</button></a>*/}
            <button id="stop" type="button" className={s.stop}>Done</button>
            <a id="cancel" href={Location.createHref("/")} className={s.cancel}>x</a>
            {/*<div onClick={this.handleClose} id="close">x</div>*/}
            <input id="go" type="submit" value="Go" className={s.space}/>
          </div>
        </form>
    );
  }

}
export default withStyles(QueryBox, s);
