import React, {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import {NativeBaseProvider, Box, Text, VStack, HStack} from 'native-base';
import MapView, {Marker} from 'react-native-maps';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import axios from 'axios';

const Location = () => {

  const [buildings, setBuildings] = useState([])

  useEffect(() => {
    axios
    .get("http://192.168.1.110:3500/carparkbuilding")
    .then(response => {
      setBuildings(response.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

  },[])

  console.log(buildings)


  //   type Location = {
  //     latitude:number,
  //     longitude:number
  //   }
  //   const [currentLocation, setCurrentLocation] = useState<Location>({latitude:0,longitude:0});
  // const requestLocationPermission = async () => {
  //       try {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //         );
  //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //           console.log('Location permission granted');
  //           getCurrentLocation();
  //         } else {
  //           console.log('Location permission denied');
  //         }
  //       } catch (error) {
  //         console.error('Error requesting location permission:', error);
  //       }
  //     }

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log('Current location:', latitude, longitude);
        },
        error => {
          console.error('Error getting current location:', error);
        },
        { enableHighAccuracy: false, timeout: 40000, maximumAge: 10000 }
      );
    };
    getCurrentLocation()

  //   requestLocationPermission()

  return (
    <VStack bg="#003572" height="100%">
      <Box mt={5}>
        <Text color="white" fontSize="20" fontWeight="bold" ml={5}>
          Locations
        </Text>
      </Box>
      {buildings.map((building:any,index: any) => (
         <Box key={building._id} mt={4} bgColor="white" justifyContent={"space-between"} p={5} mx={5} borderRadius={20}>
         <VStack space={4}>
         <HStack justifyContent={"space-between"}>
           <Text fontWeight="bold" flexShrink={1}>To {building.name}</Text>
           <Text>XX KM</Text>
         </HStack>
         <Text> ? minutes </Text>
         </VStack>
         </Box>

      )

      )}
     
      
        <MapView
          style={{flex: 1}}
          initialRegion={{
            latitude: 3.1676085,
            longitude: 101.5435088,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: 3.1676085, longitude:101.5435088
            }}
            title="Marker"
          />
        </MapView>
    </VStack>
  );
};

export default Location;
