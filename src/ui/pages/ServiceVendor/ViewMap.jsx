// Map.js
import React, { Component } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const MapContainer = (props) => {
  const { lat, lng } = this.props;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDHiN-srgNPgeP0FipCvWDSecAg_sl18lU",
  });

  return (
    <>
      {
        !isLoaded ? (
          <h1>Loading....</h1>
        ) : (
          <GoogleMap
            zoom={10}
            center={{ lat, lng }}
            mapContainerClassName="map-container"
          >
            <Marker position={{ lat, lng }} />
          </GoogleMap>
        )
      }
    </>
  );
}

export default MapContainer;
