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
import { connect } from 'react-redux';
import $ from 'jquery';
import s from './TopK.scss';

@connect((store) => {
  return {
    namedGraph: store.qa.namedGraph,
  }
})
class TopK extends Component {

  static propTypes = {
    sumid: PropTypes.string.isRequired,
    uri: PropTypes.string.isRequired,
    topK: PropTypes.number.isRequired,
    lang: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var id = this.props.sumid;
    var uri = this.props.uri;
    var topK = this.props.topK;

    $.ajaxSetup({
      accepts : {
        "json" : "application/ld+json, application/json, text/javascript"
      },
      contents : {
        "ld+json" : "application/ld+json"
      },
      converters : {
        "ld+json json" : jQuery.parseJSON
      }
    });

    var url = null;
    if (this.props.kb == "wikidata"){
      url = "https://wdaqua-summa-server.univ-st-etienne.fr/wikidata/sum" + "?entity=" + encodeURIComponent(uri) + "&topK=" + topK + "&maxHops=1" + "&language=" + this.props.lang;
    } else if (this.props.kb == "dbpedia"){
      url = "https://km.aifb.kit.edu/services/link/sum" + "?entity=" + encodeURIComponent(uri) + "&topK=" + topK + "&maxHops=1" + "&language=" + this.props.lang;
    } else if (this.props.kb == "dblp"){
      url = "https://wdaqua-summa-server.univ-st-etienne.fr/dblp/sum" + "?entity=" + encodeURIComponent(uri) + "&topK=" + topK + "&maxHops=1" + "&language=" + this.props.lang;
    } else if (this.props.kb == "musicbrainz"){
      url = "https://wdaqua-summa-server.univ-st-etienne.fr/musicbrainz/sum" + "?entity=" + encodeURIComponent(uri) + "&topK=" + topK + "&maxHops=1" + "&language=" + this.props.lang;
    } else if (this.props.kb == "scigraph"){
      url = "https://wdaqua-summa-server.univ-st-etienne.fr/scigraph/sum" + "?entity=" + encodeURIComponent(uri) + "&topK=" + topK + "&maxHops=1" + "&language=" + this.props.lang;
    } else if (this.props.kb == "freebase"){
      url = "https://wdaqua-summa-server.univ-st-etienne.fr/freebase/sum" + "?entity=" + encodeURIComponent(uri) + "&topK=" + topK + "&maxHops=1" + "&language=" + this.props.lang;
    }

    $.ajax({
      dataType : "json",
      url : url,
      beforeSend : function() {
        // show loading bar
        $("#" + id + "_loading").show();
      },
      complete : function() {
        // remove loading bar
        $("#" + id + "_loading").remove();
      },
      success : function(data) {
        $("#" + id).empty();
        function label(uri) {
          for ( k = 0; k < keys.length; k++) {
            if(data[keys[k]]["@id"] == uri){
              var part1 = data[keys[k]];
            }
          }
          if (part1 != null) {
            var labels = part1["http://www.w3.org/2000/01/rdf-schema#label"][0]["@value"];
            return labels;
          } else {
            var strArry = uri.split("/");
            strArry[strArry.length - 1] = strArry[strArry.length - 1].split("_").join(" ");
            return strArry[strArry.length - 1];
          }
        }
        var print = {
          "entity" : "",
          "statements" : []
        };

        var keys = Object.keys(data);

        for (var j = 0; j < topK; j++) {
          for (var i = 0; i < keys.length; i++) {
            var types = data[keys[i]]["http://purl.org/voc/summa/statement"];
            if (types != null) {
              print["entity"] = data[keys[i]]["http://purl.org/voc/summa/entity"][0]["@id"];
              for (var k = 0; k < keys.length; k++) {
                if (data[keys[i]]["http://purl.org/voc/summa/statement"].length > j) {
                  if(data[keys[k]]["@id"] == data[keys[i]]["http://purl.org/voc/summa/statement"][j]["@id"]){
                    var statement = {
                      "subject" : "",
                      "predicate" : "",
                      "object" : ""
                    };
                    statement["subject"] = data[keys[k]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#subject"][0]["@id"];
                    statement["predicate"] = data[keys[k]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate"][0]["@id"];
                    statement["object"] = data[keys[k]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#object"][0]["@id"];
                    print.statements.push(statement);
                  }
                }
              }
            }
          }
        }


        $("#" + id).append("<h2>Summary</h2><table></table>");
        for (var i = 0; i < print.statements.length; i++) {
          if (print.statements[i].subject == print.entity) {
            var path = "/question?query="+label(print.statements[i].object)+"&lang="+this.props.lang+"&kb="+this.props.kb+"&uri="+print.statements[i].object+"&ng="+this.props.namedGraph;
            $("#" + id).children("table").append("<tr><td>" + label(print.statements[i].predicate) + "&nbsp;&nbsp;&nbsp;&nbsp;</td><td><a href=\""+path+"\">"+label(print.statements[i].object)+"</a></td></tr>");
          } else if (print.statements[i].object == print.entity) {
            var path = "/question?query="+label(print.statements[i].subject)+"&lang="+this.props.lang+"&kb="+this.props.kb+"&uri="+print.statements[i].subject+"&ng="+this.props.namedGraph;
            $("#" + id).children("table").append("<tr><td>" + label(print.statements[i].predicate) + " of&nbsp;&nbsp;&nbsp;&nbsp;</td><td><a href=\""+path+"\">"+label(print.statements[i].subject)+"</a></td></tr>");
          }
        }
      }.bind(this),
      error: function(error){
          console.log(error);
      }
    });
  }

  componentWillUnmount(){
    var id = this.props.sumid;
    $("#" + id).empty();
    $("#" + id).remove();
  }


  render() {
    return (
      <div className={s.container}>
        <div className={s.sum} id={this.props.sumid}></div>
        <p className={s.caption}>Summary by <a href="https://km.aifb.kit.edu/services/link">https://km.aifb.kit.edu/services/link</a></p>
      </div>
    );
  }

}
export default withStyles(TopK, s);
