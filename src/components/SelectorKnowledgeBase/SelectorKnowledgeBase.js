import React, { Component } from 'react';
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SelectorKnowledgeBase.scss';
import ReactSuperSelect from 'react-super-select';
import {setKnowledgebase} from '../../actions/knowledgebase';

@connect((store) => {
  return {
    knowledgebase: store.knowledgebase.knowledgebase,
    language: store.lang.language,
  }
})
class SelectorKnowledgeBase extends Component {

  constructor(props) {
    super(props);
  }

  initialKnowledgebase(){
    console.log("Initial");
    console.log(this.props.knowledgebase)
    var initial = [];
      for (var i=0; i< this.props.knowledgebase.length; i++){
    initial.push({
      id: this.props.knowledgebase[i],
      name: this.props.knowledgebase[i],
    })
    }
    console.log(initial);
    return initial;
  }

  knowledgeBases = {
    dbpedia: require('./images/dbpedia-logo.png'),
    wikidata: require('./images/wikidata-logo.png'),
    musicbrainz: require('./images/musicbrainz-logo.png'),
    dblp: require('../../actions/knowledge_base/implemented/images/dblp_logo.png'),
    biennale: require('./images/biennale_logo.png'),
    freebase: require('./images/freebase-logo.png'),
    scigraph: require('./images/scigraph-logo.png'),
  };

  handleChange(option){
    if (typeof(option) == 'undefined'){
      console.log("REASSERT");
      this.props.dispatch(setKnowledgebase([]));
    } else {
      var kb = [];
      for (var i=0; i<option.length; i++){
        kb.push(option[i].name);
      }
      this.props.dispatch(setKnowledgebase(kb));
    }

  }

  knowledgebaseTemplate(item) {
    console.log("ITEM",item);
    console.log("ITEM",item[0]);
    console.log("ITEM",item[0].name);
    var selected = [];
    for (var i=0; i<item.length; i++){
      selected.push(<img key={i} className={s.img} src={this.knowledgeBases[item[i].name]}/>)
    }
    return(
      <div key="item.name">
        {selected}
      </div>);
  };

  flagTemplate2(item, search) {
    return(
      <div key="item.name">
        <img className={s.img} src={this.knowledgeBases[item.name]}/>
        <span>{item.name}</span>
      </div>);
  };

  render() {

    if (this.props.knowledgebase.length == 0){ //prevents that no KB is selected, by default always wikidata is selected
      this.props.dispatch(setKnowledgebase(["wikidata"]));
    }

    var options = [
      {
        id: "wikidata",
        name: "wikidata",
      },{
        id: "dbpedia",
        name: "dbpedia",
      },{
        id: "musicbrainz",
        name: "musicbrainz",
      },{
        id: "dblp",
        name: "dblp",
      },{
        id: "scigraph",
        name: "scigraph",
      }
    ];


    //<div className={[s['r-ss-remove-button'], s['r-ss-trigger'], s['r-ss-button'], s['r-ss-wrap'], s['r-ss-search-aria-label'], s['r-ss-search-inner'], s['r-ss-dropdown'], s['r-ss-page-fetch-indicator']].join(" ")}> }
    console.log("RENDER");
    return (
      <div>
        <ReactSuperSelect multiple={true} onChange={this.handleChange.bind(this)} customSelectedValueTemplateFunction={this.knowledgebaseTemplate.bind(this)} customOptionTemplateFunction={this.flagTemplate2.bind(this)}  dataSource={options} initialValue={this.initialKnowledgebase()} clearable={false} keepOpenOnSelection={true} />
      </div>
    );

  }
}

export default withStyles(SelectorKnowledgeBase, s);

