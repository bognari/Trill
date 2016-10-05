/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import ImageComponent from '../ImageComponent'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AnswerPage.scss';
//import L from 'leaflet';
import ls from '../../../node_modules/leaflet/dist/leaflet.scss';
import $ from 'jquery';
import Label from '../Label';
import Loader from 'react-loader';
import Map from '../Map';


class AnswerPage extends Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      information: [],
      SPARQLquery: "", //containes the generated sparql query
      query: false, //indicates if the answer or the query is displayed
      loaded: false, //indicates if the backend already gave back the answer
    };
    this.handleClick = this.handleClick.bind(this);
  }


  componentDidMount() {
    //retrives the answer from the gerbil interface
    var qresult = $.post("http://wdaqua-qanary.univ-st-etienne.fr/gerbil", this.props.query, function (data){
      console.log(data);

      //would like to refactor the following to separate functions. this.setState() is not recognized in
      //nested functions

      var query = data.questions[0].question.language[0].SPARQL;
      console.log("Query"+query);
      var jresult = JSON.parse(data.questions[0].question.answers);

      console.log("json");
      console.log(jresult);

      //check if it is an ask query
      if (jresult.hasOwnProperty("boolean")){
        var information = this.state.information;
        information.push({
          label: (jresult.boolean==true) ? "True" : "False",
          answerType: "simple",
        })
        this.setState({
          SPARQLquery: query,
          information: information,
          loaded: true,
        })
      } else {
        var variable=jresult.head.vars[0];
        //depending on the number of results, handle accordingly:
        if(jresult.results.bindings.length > 0 && jresult.results.bindings.length <= 1000) {
          jresult.results.bindings.map(function(binding,k) {
            if (k<20) {
              console.log("k:" + k);
              console.log(variable);
              //console.log("Variable" + jresult.head.vars[0]);
              //var variable = jresult.head.vars[0];

              var type = binding[variable].type;
              var value = binding[variable].value;
              console.log("Result " + type + " " + value);

              if (type == "uri") {
                //There is only one uri
                var sparqlQuery = "select ?label ?abstract ?image ?lat ?long where { "
                  + "<" + value + "> rdfs:label ?label . "
                  + " OPTIONAL{ "
                  + "<" + value + "> dbo:thumbnail ?image . "
                  + "} "
                  + " OPTIONAL{ "
                  + "<" + value + "> dbo:abstract ?abstract . "
                  + "} "
                  + " OPTIONAL{ "
                  + "<" + value + "> geo:lat ?lat . "
                  + "} "
                  + " OPTIONAL{ "
                  + "<" + value + "> geo:long ?long . "
                  + "} "
                  + " FILTER (lang(?label)=\"en\" && lang(?abstract)=\"en\") "
                  + " } ";

                this.serverRequest = $.get(
                  "http://dbpedia.org/sparql?query=" + encodeURIComponent(sparqlQuery) + "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_hrefs=&timeout=30000&debug=on",
                  function (result) {
                    console.log(result);

                    //to refactor the following if statements to one switch statement?
                    if (typeof result.results.bindings[0]=="undefined"){ //Case when there is no label
                      var information = this.state.information;
                      information.push({
                        label: value.replace("http://dbpedia.org/resource/", "").replace("_", " "),
                        loaded: true,
                        answertype: "nolabel",
                        link: value,
                      })

                      this.setState({
                        SPARQLquery: query,
                        information: information,
                        loaded: true,
                      });
                    } else {
                      console.log("Label" + result.results.bindings[0].label.value);
                      console.log("Abstract" + result.results.bindings[0].abstract.value);

                      var image = (result.results.bindings[0].image != undefined) ? result.results.bindings[0].image.value : "";
                      var information = this.state.information;
                      information.push({
                        label: result.results.bindings[0].label.value,
                        abstract: result.results.bindings[0].abstract.value,
                        image: image,
                        loaded: true,
                        answertype: "detail",
                        link: value
                      })

                      if (result.results.bindings[0].lat.value != undefined){ //if there are geo coordinates
                        information.push({
                          answertype: "map",
                          lat: result.results.bindings[0].lat.value,
                          long: result.results.bindings[0].long.value
                        })
                      }

                      this.setState({
                        SPARQLquery: query,
                        information: information,
                        loaded: true,
                      })


                      //----- from here is just a test to display map -------
                      // this if statement will instead have to be a switch statement to check for the answer type to be a map.
                      // Perhaps these kind of displays should only be used when there is one result, not more. Lists would have
                      // their own separate display type (answertype: list, for example)
                      if(result.results.bindings[0].lat.value != undefined){

                       // L.scss("../../../node_modules/leaflet/dist/leaflet.scss");

                      //   L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images/';
                      //   var map = L.map('map');
                      //   map.setView([47.63, -122.32], 11);
                      //
                      //   var attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>';
                      //
                      //   var tiles = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png';
                      //
                      //   var layer = L.tileLayer(tiles, {
                      //     maxZoom: 18,
                      //     attribution: attribution
                      //   });
                      //
                      //   layer.addTo(map);
                      //

                        // setTimeout(function() {
                        //   var L = require('leaflet');
                        //
                        //   var map = L.map('map').setView([result.results.bindings[0].lat.value, result.results.bindings[0].long.value], 13);
                        //
                        //   L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                        //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        //   }).addTo(map);
                        //
                        //   L.marker([result.results.bindings[0].lat.value, result.results.bindings[0].long.value]).addTo(map)
                        //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
                        //     .openPopup();
                        //
                        //   map.css(ls);
                        //
                        // }.bind(this), 1000);

                       }

                      //------ test code ends here --------------------------


                    }
                  }.bind(this), "json")
              }
              else if (type == "typed-literal" || type == "literal") {
                var information = this.state.information;
                information.push({
                  label: binding[variable].value,
                  loaded: true,
                  answertype: "simple"
                })
                this.setState({
                  SPARQLquery: query,
                  information: information,
                  loaded: true,
                });
              }
            }
          }.bind(this), "json")
        }
        else { //if there are no results
          this.setState({
            SPARQLquery: query,
            label: "No results",
            loaded: true,
            answertype: "simple"
          });
        }
      }
    }.bind(this), "json");

    // qresult.done(function (data){
    //   console.log("This is when the get finishes............:");
    //   console.log(" ");
    // });

  }

  handleClick() {
    this.setState({query: !this.state.query}); //on click switch from query to answer
  }

  render() {
    console.log("query paramsss...............:");
    console.log(this.props.query);

    // var answerformat;
    // if (this.state.answertype == "simple") {
    //   answerformat = <Label>{this.state.abstract}</Label>;
    // } else if (this.state.answertype == "detail") {
    //   answerformat = ();
    // }
    // else {}

//to refactor so don't have to check the same answer type multiple times
    console.log("Loaded "+this.state.loaded);
    console.log("Information "+this.state.information.length);


    return (
      <div className={s.container}>
        <Loader loaded={this.state.loaded}>
          <div onClick={this.handleClick} className={s.sparql}>
            Q
          </div>
          <br/>
          <br/>
          {(this.state.query) ? <Label>{this.state.SPARQLquery}</Label> : null}
          {this.state.information.map(function(info,index) {
            console.log("k"+index);
            console.log(info);
            return (
              <div key={index} >
                 {(info.answertype == "simple") ? <Label css={s.answer}>{info.label}</Label> : null}
                {(info.answertype == "nolabel") ? <a href={info.link} className={s.link}><Label css={s.answer}>{info.label}</Label></a> : null}
                 {(info.answertype == "detail") ? <div className={s.textboxes}>
                 <a href={info.link} className={s.link}><Label css={s.answer}>{info.label}</Label></a>
                 <Label>{info.abstract}</Label>
                 </div> : null}
                {(info.answertype == "detail") ? <ImageComponent image={info.image}></ImageComponent> : null}
                {(info.answertype == "map") ? <Map></Map> : null}
              </div>)
          }.bind(this), "json")}
        </Loader>

      </div>
    );
  }


}
export default withStyles(AnswerPage, s, ls);
