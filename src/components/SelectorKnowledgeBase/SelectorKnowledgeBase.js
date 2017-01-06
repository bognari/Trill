import React, { Component } from 'react';
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SelectorKnowledgeBase.scss';
import ReactSuperSelect from 'react-super-select';
import {setLanguage} from '../../actions/language';

@connect((store) => {
  return {
    language: store.lang.language,
  }
})
class SelectorKnowledgeBase extends Component {

  handleChange(option){
    //this.props.dispatch(setLanguage(option.name));
  }

  render() {

    var options = [
      {
        id: 1,
        name: "Wikidata",
      },{
        id: 2,
        name: "Dbpedia",
      }
    ];

    var flagTemplate = function(item, search) {
      var knowledgeBases = {
        dbpedia: require('./images/dbpedia-logo.png'),
        wikidata: require('./images/wikidata-logo.png'),
      };

      return(
        <div key="item.name">
          <img className="flag" src={knowledgeBases[item.name]}/>
        </div>);
    };

    return (
      <ReactSuperSelect onChange={this.handleChange.bind(this)} customOptionTemplateFunction={flagTemplate}  dataSource={options} initialValue={options[0]} clearable={false} deselectOnSelectedOptionClick={false} />
    );

  }
}

export default withStyles(SelectorKnowledgeBase, s);

