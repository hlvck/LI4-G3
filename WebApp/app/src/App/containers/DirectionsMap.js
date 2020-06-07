/* global google */
import React from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";

class DirectionsMap extends React.Component {
  constructor(props) {
    super(props);
    this.handleMapReady = this.handleMapReady.bind(this);
  }
  
  handleMapReady(mapProps, map) {
    this.calculateAndDisplayRoute(map);
  }

  calculateAndDisplayRoute(map) {
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
     
    
    const waypoints = this.props.Data.map(item =>{
      return{
        location: {lat: item.latitude, lng:item.longitude},
        stopover: true
      }
    })
    const origin = { lat: this.props.Data[0].latitude, lng:this.props.Data[0].longitude};
    const destination = {lat: this.props.Data[this.props.Data.length-1].latitude, lng: this.props.Data[this.props.Data.length-1].longitude} ;
    
    directionsService.route({
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  calculateDistance() {
    const service = new google.maps.DistanceMatrixService();
    const origin = { lat: 41.747927, lng: -8.8517938};
    const destination = {lat: 41.847927, lng: -8.6517938};
    service.getDistanceMatrix(
    {
        
      
      origins: origin,
      destinations: destination,
      travelMode: 'DRIVING'
    },
      (response, status) => {
        console.log('response', response);
        console.log('status', status);
        }
      );
    }

  render() {
    return (
      <div style={{height: '25%', width: '75%'}}>
        <Map
          google={this.props.google}
          className={"map"}
          zoom={10}
          initialCenter={{ lat:41.5618, lng:-8.29563 }}
          onReady={this.calculateDistance}
        />
      </div>
    );
  }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyD94bNwC33Z03mXP2n1toNLXj8eCAQgOYQ'),
    libraries: []
})(DirectionsMap)