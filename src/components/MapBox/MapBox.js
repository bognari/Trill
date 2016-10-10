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
import s from './MapBox.scss'
import { render } from 'react-dom';

class MapBox extends Component {

  static propTypes = {
    lat: PropTypes.float,
    long: PropTypes.float,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {

      var L = require('leaflet');

      var map = L.map('map').setView([this.props.lat, this.props.long], 13);

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker([this.props.lat, this.props.long]).addTo(map)
        //.bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();



    //===========

    // var L, {Map, TileLayer, Marker, Popup} = require('react-leaflet');

    // var position = [this.props.lat, this.props.long];
    //
    // const map = (
    //   <Map center={position} zoom="13">
    //     <TileLayer
    //       attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //       url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    //     />
    //     <Marker position={position}>
    //       <Popup>
    //         <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
    //       </Popup>
    //     </Marker>
    //   </Map>
    // );
    //
    // render(map, document.getElementById('map'));

  }


  render() {

    return (
      <div className={s.container}>
        <div id="map" className={s.map}>
        </div>
      </div>
    );
  }

}
export default withStyles(MapBox, s);
