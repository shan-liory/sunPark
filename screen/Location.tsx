import React, {useState, useEffect} from 'react';
import { PermissionsAndroid } from 'react-native';
import {NativeBaseProvider, Box, Text, VStack} from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

const Location = () => {
//   type Location = {
//     latitude:number,
//     longitude:number
//   }
//   const [currentLocation, setCurrentLocation] = useState<Location>({latitude:0,longitude:0});
const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } catch (error) {
        console.error('Error requesting location permission:', error);
      }
    } 
  

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log('Current location:', latitude, longitude);
      },
      error => {
        console.error('Error getting current location:', error);
      },
      { enableHighAccuracy: true, timeout: 40000, maximumAge: 10000 }
    );
  };

  requestLocationPermission()

  return (
      <VStack bg="#003572" height="100%">
        <Box mt={5}>
          <Text color="white" fontSize="20" fontWeight="bold" ml={5}>
            Location
          </Text>
        </Box>
        {/* <Box flex={1}>
        {currentLocation && (<MapView style={{flex:1}} initialRegion={{
        latitude: currentLocation.latitude,
        longitude:currentLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
        <Marker coordinate={{ latitude:currentLocation.latitude, longitude: currentLocation.longitude }} title="Marker" />
      </MapView>)
}
      </Box> */}
      </VStack>
  );
};

export default Location;
