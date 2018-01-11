/**
 * Trill (http://www.wdaqua.eu/)
 *
 * Copyright © 2014-2017 University Jean Monet, All rights reserved.
 *
 */

import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';


import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AnswerPage.scss';
import Loader from 'react-loader';
import Error from '../Error';
import Feedback from '../Feedback';
import SparqlList from '../SparqlList';
import Interpretation from '../Interpretation';
import Entity from '../DidYouMean';


import AnswerListElements from '../AnswerListElements/AnswerListElements';
import Pagination from '../Pagination/Pagination';
import {Condition, Case} from 'react-case';
import LazyLoad from 'react-lazy-load';
import Confidence from "../Confidence/Confidence";

import Link from "../Link/Link";
import index from "../../stores/index";

@connect((store) => {
  return {
    uriInput: store.qa.uriInput,
    query_question: store.route.query, //input over the uri get parameters
    query_lang: store.route.lang,
    query_kb: store.route.kb,

    question: store.qa.question,  //input over the information in the store
    namedGraph: store.qa.namedGraph,
    information: store.qa.information,
    SPARQLquery: store.qa.SPARQLquery,    //containes the generated sparql query
    sparqlInterpretationloaded: store.qa.sparqlInterpretationloaded,              //indicates if the backend already gave back the answer
    sparqlInterpretationError: store.qa.sparqlInterpretationError,
    audiofile: store.qa.audiofile,
    qinitiated: store.qa.qinitiated,
    language: store.lang.language,
    knowledgebase: store.knowledgebase.knowledgebase,
    informationLoaded : store.qa.informationLoaded,
    loaded: store.qa.loaded,
  }
})
class AnswerPage extends Component {
  /* {this.props.information.map(function (info, index) {
                     console.log("ENTERED");

                       return(
                       <div key={index}>
                         { (index < 20) ?
                           <AnswerListElements id={index} index={index} information={info} collapsible ={k>1} loaded={this.props.informationLoaded[index]}>
                           </AnswerListElements>
                         : null }
                       </div>
                   );




                    }.bind(this))}*/
  constructor(props) {
    super(props);
    var exampleItems  = this.props.information;
    // noinspection JSAnnotator
    this.state = {
      exampleItems: exampleItems,
      pageOfItems: [],
    };
    this.onChangePage = this.onChangePage.bind(this);

  }
  onChangePage(pageOfItems) {
    // update state with new page of items

    this.setState({ pageOfItems: pageOfItems });

  }


  render() {
    let k = this.props.information.length;
    console.log("LA Valeur de K est                              jlsdfkjlsdhfsdhfhsdlfjlksdjfmksdjflsdkjflsdlfkjsdlfsdlkflskdjl : " + k);
    this.state.exampleItems = this.props.information;
    return (
      <div className={s.container}>
        <Loader loaded={this.props.loaded} color="#333">
          {(this.props.error) ? <Error>Error</Error> : //check if an error occured
            <div>
              {this.props.information.length > 0 ?  //check if there is an answer
                <div>
                  <div className={s.buttonmenu}>
                    {/*<Confidence query={this.props.SPARQLquery[0]}/> */}
                    <SparqlList sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/>
                    {(this.props.SPARQLquery != "") ? <Entity sparqlquery={this.props.SPARQLquery} namedGraph={this.props.namedGraph}/> : null}
                    <Feedback className={s.feedback}/>
                    <Interpretation index={0}/>
                  </div>


                  {this.state.pageOfItems.map(function (info, index) {
                    return(
                    <div key={index}>
                        {(index < 20) ?
                          <AnswerListElements id={index} index={index} information={info} collapsible={k < 1} loaded={this.props.informationLoaded[index]} >
                          </AnswerListElements>
                          : null}

                      </div>);
                  }.bind(this))}
                  <Pagination items={this.state.exampleItems} onChangePage={this.onChangePage} />


                </div>
                : <div>No Answer</div>}
            </div>
          }
          {/*Dont't delete the next line to fullfill cc-by copyright of scigraph */}
          {this.props.knowledgebase=="scigraph" ? <div className={s.copyright}>This informations comes from <a href="http://scigraph.springernature.com/">Scigraph</a></div> : null}
        </Loader>
        <div className={s.bottom}/>
      </div>
    );
  }

}

export default withStyles(AnswerPage, s);
