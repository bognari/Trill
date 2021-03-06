/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HeaderSearch.scss';
import n from '../Navigation/Navigation.scss';
import Link from '../Link';
import Navigation from '../Navigation';
import QueryBox from '../QueryBox';
import BiennaleNav from '../BiennaleNav';

@connect((store) => {
  return {
    question: store.qa.question,
    location: store.route.location,
    knowledgebase: store.knowledgebase.knowledgebase,
  }
})
class HeaderSearch extends Component {

  handlerExample() {
    console.log("Here");
  }

  render() {
    //<div className={s.banner}>
    console.log("Current path: ", this.props.location);
    return (
      <div className={this.props.knowledgebase=="biennale" ? s.rootBiennale : s.root}>
        <div className={s.container}>

          <Navigation className={s.nav} linkClassName={n.darklink}/>
          {(this.props.location == "/")? <div className={s.placeholder}></div> : <Link className={s.brand} to="/">
            <img src={require('./../../public/WDAquaLogoSmall.png')} height="24" alt="WDAqua" className={s.logo}/>
            &nbsp;
            </Link>}
              {(["/question"].indexOf(this.props.location) == -1) ? null : <QueryBox size="50" header={true}/>}
          {this.props.knowledgebase=="biennale" ? <BiennaleNav/>: null}
        </div>
      </div>
    );
  }

}

export default withStyles(HeaderSearch, s);
