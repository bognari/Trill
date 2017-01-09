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

  handleChange(option){
      this.props.dispatch(setKnowledgebase(option.title));
  }

  render() {

    var options = [
      {
        id: 1,
        name: "wikidata",
      },{
        id: 2,
        name: "dbpedia",
      }
    ];

    var flagTemplate = function(item, search) {
      var knowledgeBases = {
        dbpedia: require('./images/dbpedia-logo.png'),
        wikidata: require('./images/wikidata-logo.png'),
      };

      return(
        <div key="item.name">
          <img className={s.img} src={knowledgeBases[item.name]}/>
        </div>);
    };

    console.log("Knowledgebase"+this.props.knowledgebase);

    return (
      <ReactSuperSelect onChange={this.handleChange.bind(this)} customOptionTemplateFunction={flagTemplate}  dataSource={(this.props.language=="en") ? options : [options[0]]} initialValue={(this.props.knowledgebase=="wikidata") ? options[0] : options[1]} clearable={false} deselectOnSelectedOptionClick={false} />
    );

  }
}

export default withStyles(SelectorKnowledgeBase, s);

