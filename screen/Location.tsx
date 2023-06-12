import React, {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import {
  NativeBaseProvider,
  Box,
  Text,
  VStack,
  HStack,
  Spinner,
} from 'native-base';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

const Location = () => {
  type Location = {
    latitude: number;
    longitude: number;
  };

  const [currentLocation, setCurrentLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  type Building = [{
    _id: string;
    name: string;
    latitude: number;
    longitude: number;
  }]

  const [buildings, setBuildings] = useState<Building>([{
    _id: "",
    name: "",
    latitude: 0,
    longitude: 0,
  }]);

  const [etaDistances, setEtaDistances] = useState<any>([]);

  useEffect(() => {
    axios
      // .get("http://192.168.1.110:3500/carparkbuilding")
      .get('http://172.20.10.4:3500/carparkbuilding')
      .then(response => {
        setBuildings(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  console.log(buildings);

  useEffect(() => {
    const requestLocationPermission = async ()  => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;
              setCurrentLocation({latitude, longitude});
            },
            error => console.error(error),
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
          );
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {}
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    const fetchEtaDistances = async () => {
      const results = [];
      for (const building of buildings) {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${building.latitude},${building.longitude}&key=AIzaSyC5SD9ibmsRme7-gSoPKbD83CCznYox76Q`
          );

          const { duration, distance } = response.data.routes[0].legs[0];

          const eta = duration.text;
          const distanceText = distance.text;

        
            results.push({ eta, distanceText });
        
          console.log(results)

        } catch (error) {
          results.push({distanceText:"0 km", eta:"0 min"});
          // console.error('Error:', error);
        }
      }

      setEtaDistances(results);
    };

    fetchEtaDistances();
  }, [buildings]);


  return (
    <VStack bg="#003572" height="100%">
      <Box mt={5}>
        <Text color="white" fontSize="20" fontWeight="bold" ml={5}>
          Locations
        </Text>
      </Box>
      {buildings.map((building: any, index: any) => (
        <Box
          key={building._id}
          mt={4}
          bgColor="white"
          justifyContent={'space-between'}
          p={5}
          mx={5}
          borderRadius={20}>
          <VStack space={4}>
            <HStack justifyContent={'space-between'}>
              <Text fontWeight="bold" flexShrink={1}>
                To {building.name}
              </Text>
              <Text>{etaDistances[index]?.distanceText} </Text>
            </HStack>
            <Text> {etaDistances[index]?.eta} </Text>
          </VStack>
        </Box>
      ))}

      {currentLocation.latitude && currentLocation.longitude != 0 ? (
        <MapView
          style={{flex: 1}}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Marker"
          />
        </MapView>
      ) : (
        <Spinner />
      )}
    </VStack>
  );
};

export default Location;
