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
import s from './Label.scss';

class Label extends Component {

  static propTypes = {
    type: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.querySelector('#seemore').onclick = function(){
      document.querySelector('#seeblock').style = "display: none";
      document.querySelector('#secondhalf').style = "display: inline";
      document.querySelector('#seeless').style = "display: inline";
    }

    document.querySelector('#seeless').onclick = function(){
      document.querySelector('#seeblock').style = "display: inline";
      document.querySelector('#secondhalf').style = "display: none";
      document.querySelector('#seeless').style = "display: none";
    }
  }

  render() {
    var largetext = false;
    if (this.props.children.length >= 1500){
      largetext = true;
      var firsthalf = this.props.children.slice(0, 1500);
      var secondhalf = this.props.children.slice(1500);
    }

    return (
      <div className={this.props.type == 'title'? s.title : s.normal}>
        {largetext ? <p><span>{firsthalf}</span><span id="seeblock">... <span id="seemore" className={s.seemore}>see more</span></span><span id="secondhalf" className={s.secondhalf}>{secondhalf}</span> <span id="seeless" className={s.seeless}>see less</span></p> : <p>{this.props.children}</p>}
      </div>
    );
  }

}
export default withStyles(Label, s);
