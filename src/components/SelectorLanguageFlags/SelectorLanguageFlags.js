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
  }
})
class LanguageSelectorFlags extends Component {

  handleChange(option){
    this.props.dispatch(setLanguage(option.name));
    if (option.name!="en"){
      this.props.dispatch(setKnowledgebase("wikidata"));
    }
  }

  render() {
    var flags = [
      {
        id: 1,
        name: "en",
      },{
        id: 2,
        name: "de",
      },{
        id: 3,
        name: "fr",
      },{
        id: 4,
        name: "it",
      }
    ];

    var flagTemplate = function(item, search) {
      var flags = {
        de: require('./images/flags/de.png'),
        en: require('./images/flags/gb.png'),
        fr: require('./images/flags/fr.png'),
        it: require('./images/flags/it.png'),
      };

      return(
        <div key="item.name">
          <img className={s.img} src={flags[item.name]}/>
        </div>);
    };

    return (
      <ReactSuperSelect onChange={this.handleChange.bind(this)} customOptionTemplateFunction={flagTemplate}  dataSource={flags} initialValue={flags[0]} clearable={false} deselectOnSelectedOptionClick={false} />
    );
  }
}

export default withStyles(LanguageSelectorFlags, s);

