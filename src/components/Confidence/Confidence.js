/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Confidence.scss';
import $ from 'jquery';
import { connect } from 'react-redux';
import {qanary_services} from '../../config';


class Confidence extends Component {

  //other options https://www.bram.us/projects/js_bramus/jsprogressbarhandler/#license_usage
  // http://kimmobrunfeldt.github.io/progressbar.js/

  render() {
    var confidence= this.props.confidence;
    var color = this.perc2color(confidence*100);
    return (
      <div className={s.container}>
        <div className="color-box" style={{backgroundColor: color, width: "50px", height: "50px"}}></div>
      </div>
    );
  }

  perc2color(perc) {
    var r, g, b = 0;
    if(perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    }
    else {
      g = 255;
      r = Math.round(510 - 5.10 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
  }

}
export default withStyles(Confidence, s);


