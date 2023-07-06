import React, {useState, useEffect, useCallback} from 'react';
import {RefreshControl, ScrollView, PermissionsAndroid} from 'react-native';
import {Box, Text, VStack, HStack, Spinner, Pressable} from 'native-base';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {useRoute, useNavigation} from '@react-navigation/native';

const Location = () => {
  const ipAddress1 = 'http://172.20.10.4:3500';
  const ipAddress2 = 'http://192.168.1.104:3500';

  let selectedIpAddress = ipAddress2;
  const navigation = useNavigation<any>();
  const [etaDistances, setEtaDistances] = useState<any>([]);

  type Location = {
    latitude: number;
    longitude: number;
  };

  type Building = {
    _id: string;
    name: string;
    latitude: number;
    longitude: number;
  }[];

  const [currentLocation, setCurrentLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  const [buildings, setBuildings] = useState<Building>([]);

  useEffect(() => {
    axios
      //.get("http://192.168.1.111:3500/carparkbuilding")
      .get(`${selectedIpAddress}/carparkbuilding`)
      .then(response => {
        setBuildings(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const requestLocationPermission = async () => {
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
            error => console.error('location', error),
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
      if (currentLocation && buildings.length > 0) {
        const results = [];
        for (const building of buildings) {
          console.log('test');
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${building.latitude},${building.longitude}&key=AIzaSyC5SD9ibmsRme7-gSoPKbD83CCznYox76Q`,
            );
            console.log('test3');
            const {duration, distance} = response.data.routes[0].legs[0];
            const eta = duration.text;
            const distanceText = distance.text;
            // console.log({eta, distanceText});
            results.push({eta, distanceText});
          } catch (error) {
            console.error('Error:', error);
          }
        }
        console.log('results', results);
        setEtaDistances(results);
      }
    };
    fetchEtaDistances();
  }, [currentLocation, buildings]);

  return (
    <VStack bg="#003572" height="100%">
      <Box mt={5}>
        <Text color="white" fontSize="20" fontWeight="bold" ml={5}>
          Locations
        </Text>
      </Box>
      <ScrollView>
        {buildings.map((building: any, index: any) => (
          <Pressable
            key={building._id}
            onPress={() =>
              navigation.navigate('Maps', {currentLocation, building})
            }>
            <Box
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
                  <Text>{etaDistances[index]?.distanceText}</Text>
                </HStack>
                <Text>{etaDistances[index]?.eta}</Text>
              </VStack>
            </Box>
          </Pressable>
        ))}
      </ScrollView>
    </VStack>
  );
};

export default Location;
