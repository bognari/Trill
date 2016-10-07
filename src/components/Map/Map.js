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
import s from './Map.scss'
import L, {Map, TileLayer, Marker, Popup} from 'react-leaflet'
//import L from 'react-leaflet'
//import l from './Leaflet.scss';
//import l from '../../../node_modules/leaflet/dist/leaflet.scss';

class Map extends Component {

  static propTypes = {
    lat: PropTypes.float,
    long: PropTypes.float,
  };

  constructor(props) {
    super(props);
    this.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 13,
    }
  }


  componentDidMount() {

     //  var L = require('react-leaflet');
     // // require('leaflet/dist/leaflet.css');
     //
     //  var map = L.map('map').setView([this.props.lat, this.props.long], 13);
     //
     //  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
     //    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
     //  }).addTo(map);
     //
     //  L.marker([this.props.lat, this.props.long]).addTo(map)
     //    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
     //    .openPopup();

      //map.css('../../../node_modules/leaflet/dist/leaflet.scss');

  }

  render() {

      var position = [this.state.lat, this.state.lng];

    return (
      <div>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          <Marker position={position}>
            <Popup>
              <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
            </Popup>
          </Marker>
          </Map>
      </div>
    );
  }

}
export default withStyles(Map, s);
