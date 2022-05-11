import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { Container } from "react-bootstrap";

const mapStyles = {
  width: '50%',
  height: '50%',
};

export class MapPage extends Component {
    render() {
      return (
        <div>
            <div className="row test-container">
                <h1 className="test-text">hi</h1>
                <h1 className="test-text">hi</h1>
                <h1 className="test-text">hi</h1>
                <h1 className="test-text">hi</h1>
            </div>
            <div className="row">
                <Map
                    google={this.props.google}
                    zoom={10}
                    style={mapStyles}
                    initialCenter={
                        {
                        lat: 34.0344189,
                        lng: -118.2321198
                        }
                    }
                />
            </div>
        </div>
      );
    }
  }

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAdU05dtfsuSPJYJJ_fe87S08nBCfLuxYI'
})(MapPage)

//export default MapPage