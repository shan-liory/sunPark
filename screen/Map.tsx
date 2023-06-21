import React, {useEffect, useState} from 'react';
import { Linking } from 'react-native';
import MapView, {Polyline,Marker} from 'react-native-maps';
import axios from 'axios';
import {
  Box,
  Text,
  Button,
  Spinner,
} from 'native-base';
import {useRoute, useNavigation} from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';

const Maps = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [coordinates] = useState([
    {
      latitude: route.params.currentLocation.latitude,
      longitude: route.params.currentLocation.longitude,
    },
    {
      latitude: route.params.building.latitude,
      longitude: route.params.building.longitude,
    },
  ]);

  const openGoogleMapsApp = (origin:any, destination:any) => {
    console.log("here", origin.latitude +","+ origin.longitude  ) 
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}`;
  
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.error('Cannot open Google Maps app');
        }
      })
      .catch(error => {
        console.error('Error occurred while opening Google Maps app', error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?destination=${coordinates[1].latitude}%2C${coordinates[1].longitude}&origin=${coordinates[0].latitude}%2C${coordinates[0].longitude}&key=AIzaSyC5SD9ibmsRme7-gSoPKbD83CCznYox76Q`,
        );
        // console.log(response);
        const routePoints = response.data.routes[0].overview_polyline.points;
        // setShowRoute(decodePolyline(routePoints));
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);
console.log(coordinates)
  return (
    <Box bg="#003572" flex={1} alignContent="center">
      <Text fontSize="20" ml={5} fontWeight="bold" mt={5} color="white">
        Route
      </Text>
      <Box alignItems="center" mt={4}>
        <Text fontWeight="bold" color="white" mb={4}>
          To {route.params.building.name}
        </Text>
      </Box>
      {route.params.currentLocation.latitude &&
      route.params.currentLocation.longitude != 0 ? (
        <MapView
        style={{flex:1}}
          initialRegion={{
            latitude: coordinates[1].latitude,
            longitude: coordinates[1].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker coordinate={coordinates[0]} title="Marker"   image={require('../asset/pin.png')} />
          <Marker coordinate={coordinates[1]} title="Marker" />
          <MapViewDirections
            origin={coordinates[0]}
            destination={coordinates[1]}
            apikey={'AIzaSyC5SD9ibmsRme7-gSoPKbD83CCznYox76Q'} // insert your API Key here
          />
        </MapView>
      ) : (
        <Spinner />
      )}
       <Button onPress={() => openGoogleMapsApp(coordinates[0], coordinates[1])}> Get Direction </Button>
      </Box> 
  );
};

export default Maps;
