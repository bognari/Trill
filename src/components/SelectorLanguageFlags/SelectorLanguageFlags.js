/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import {connect} from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SelectorLanguageFlags.scss';
import ReactSuperSelect from 'react-super-select';
import {setLanguage} from '../../actions/language';
import {setKnowledgebase} from '../../actions/knowledgebase';

@connect((store) => {
  return {
    language: store.lang.language,
    knowledgebase: store.knowledgebase.knowledgebase,
  }
})
class LanguageSelectorFlags extends Component {

  initialFlag = {
    id: this.props.language,
    name: this.props.language,
  }

  options = [
    {
      id: "en",
      name: "English",
    },{
      id: "de",
      name: "Deutsch",
    },{
      id: "fr",
      name: "Francais",
    },{
      id: "it",
      name: "Italiano",
    },{
      id: "es",
      name: "Español",
    }
  ];

  flags = {
    de: require('./images/flags/germany.png'),
    en: require('./images/flags/united-kingdom.png'),
    fr: require('./images/flags/france.png'),
    it: require('./images/flags/italy.png'),
    es: require('./images/flags/spain.png'),
  }

  flagTemplate(item, search) {
    console.log("item flag");
    console.log(item);
    return(
      <div key="item.name">
        <img className={s.img} src={this.flags[item.id]}/>
        <span>{item.name}</span>
      </div>);
  }

  flagSelected(item) {
    var selected = [];
    for (var i=0; i<item.length; i++){
      selected.push(<img key={i} className={s.img} src={this.flags[item[i].id]}/>)
    }
    return(
      <div key="item">
        {selected}
      </div>);
  }


  handleChange(option){
    this.props.dispatch(setLanguage([option.id]));
  }

  render() {
    return (
      <ReactSuperSelect onChange={this.handleChange.bind(this)} customSelectedValueTemplateFunction={this.flagSelected.bind(this)} customOptionTemplateFunction={this.flagTemplate.bind(this)}  dataSource={this.options} initialValue={this.initialFlag} clearable={false} deselectOnSelectedOptionClick={false} />
    );
  }
}

export default withStyles(LanguageSelectorFlags, s);

