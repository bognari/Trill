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
import s from './MapBoxBig.scss'
import { render } from 'react-dom';



class MapBoxBig extends Component {

  constructor(props) {
    super(props);
    this.state = {
      render: false,
    }
  }

  componentDidMount() {

    var L2 = require('leaflet');

    var lat_max = this.props.information[0].lat;
    console.log("lat_max " + lat_max);
    var lat_min = this.props.information[0].lat;
    console.log("lat_min " + lat_min);
    var long_max = this.props.information[0].long;
    var long_min = this.props.information[0].long;
    for (var i = 0; i < this.props.information.length; i++) {
      if (this.props.information[i].lat != null) {
        if (this.props.information[i].lat > lat_max) {
          lat_max = this.props.information[i].lat;
        }
        if (this.props.information[i].lat < lat_min) {
          lat_min = this.props.information[i].lat;
        }
        if (this.props.information[i].long > long_max) {
          long_max = this.props.information[i].long;
        }
        if (this.props.information[i].long < long_min) {
          long_min = this.props.information[i].long;
        }
      }
    }
    console.log("lat_max " + lat_max);
    console.log(lat_min);
    console.log(long_min);

    if (lat_max != null && lat_min != null) {
      var corner1 = L2.latLng(lat_min, long_min),
        corner2 = L2.latLng(lat_max, long_max),
        bounds = L2.latLngBounds(corner1, corner2);
      var map = L2.map(this.props.mapid).fitBounds(bounds);

      L2.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      for (var i = 0; i < this.props.information.length; i++) {
        if (this.props.information[i].lat != null && this.props.information[i].long != null) {
          if (this.props.information[i].label != null) {
            L2.marker([this.props.information[i].lat, this.props.information[i].long]).addTo(map)
              .bindPopup(this.props.information[i].label);
          } else {
            L2.marker([this.props.information[i].lat, this.props.information[i].long]).addTo(map);
          }
        }
      }
      this.setState({render: true});
    }




    //===========

    // var L, {Map, TileLayer, Marker, Popup} = require('react-leaflet');

    // var position = [this.props.information.lat, this.props.information.long];
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
    if (this.state.render == true){
      return (
        <div className={s.container}>
          <div id={this.props.mapid} className={s.map}/>
        </div>
      );
    } else {
      return (null)
    }

  }

}
export default withStyles(MapBoxBig, s);
