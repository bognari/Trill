/**
 * Created by Dennis on 20/06/17.
 */

import store from '../../stores/index';
// import {Parser} from 'sparqljs';

export const ITEM_KNOWLEDGEBASE_REQUEST = 'ITEM_KNOWLEDGEBASE_REQUEST';
export const ITEM_KNOWLEDGEBASE_SUCCESS = 'ITEM_KNOWLEDGEBASE_SUCCESS';
export const ITEM_KNOWLEDGEBASE_FAILURE = 'ITEM_KNOWLEDGEBASE_FAILURE';

export default class ResultSetKnowledgeBase{

  constructor(jresult, query){
    console.log("QUERY "+query);
    console.log("QUERY "+jresult);
    this.jresult = jresult;
    this.query = query;
    this.information = [];
    this.informationItem = {kb: null, literal: null, uri: null, abstract: null, links: null, label: null, image: null, lat: null, long: null, youtube: null};
    this.kb = null;
  }

  get(uri , callback){}

  startRequest(){
    return function (dispatch) {
      dispatch({
        type: ITEM_KNOWLEDGEBASE_REQUEST,
      })
      dispatch(this.fullRequest());
    }.bind(this)
  }

  fullRequest(){
    return function (dispatch){
      //Check if ask query
      var SparqlParser = require('sparqljs').Parser;
      var parser = new SparqlParser();
      var parsedQuery = parser.parse(this.query);
      if (parsedQuery.queryType === "ASK"){
        var informationItem = Object.assign({}, this.informationItem);
        informationItem.kb = this.kb;
        informationItem.literal = this.jresult.boolean.toString();
        this.information.push(informationItem);
        dispatch({
          type: ITEM_KNOWLEDGEBASE_SUCCESS,
          information: this.information
        })
      } else {
        this.get(this.query, store.getState().lang.language, function callback(result){
          if (result=="error"){
            dispatch(this.error(result));
          } else {
            this.information.kb = this.kb;
            dispatch({
              type: ITEM_KNOWLEDGEBASE_SUCCESS,
              information: this.information
            })
          }
        }.bind(this))
      }
    }.bind(this)
  }

  error(err){
    return function (dispatch){
      dispatch({
        type: ITEM_KNOWLEDGEBASE_FAILURE,
        index: this.k,
        error: err,
      })
    }.bind(this)
  }

  literal(result,i,variable,lang,informationItem){
    var value = result.results.bindings[i][variable].value;
    var type = result.results.bindings[i][variable].type;
    console.log(type+"---"+value);
    if (type == "literal") {
      informationItem.literal = value;
      informationItem.pageRank = 0;
    } else if (type == "typed-literal") {
      if (result.results.bindings[i][variable].datatype === "http://www.w3.org/2001/XMLSchema#decimal" ||
        result.results.bindings[i][variable].datatype === "http://www.w3.org/2001/XMLSchema#integer" ||
        result.results.bindings[i][variable].datatype === "http://www.w3.org/2001/XMLSchema#nonNegativeInteger") {
        informationItem.literal = parseFloat(value).toLocaleString("DE-de");
        informationItem.pageRank = 0;
      } else if (result.results.bindings[i][variable].datatype === "http://www.w3.org/2001/XMLSchema#dateTime") {
        var today  = new Date(value);
        var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        //2008-01-01T00:00:00Z
        informationItem.literal = today.toLocaleDateString(lang, options);
        informationItem.pageRank = 0;
      } else {
        informationItem.literal = value;
        informationItem.pageRank = 0;
      }
    }
    console.log("LITERAL ");
    console.log(informationItem);
    return informationItem;
  }
}
