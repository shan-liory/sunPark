import React, {useState, useEffect, useCallback} from 'react';
import {RefreshControl, ScrollView, PermissionsAndroid} from 'react-native';
import {Box, Text, VStack, HStack, Spinner, Pressable} from 'native-base';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {useRoute, useNavigation} from '@react-navigation/native';
import {axiosInstance} from '../api';

type Location = {
  latitude?: number;
  longitude?: number;
} | null;

type Building = {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
}[];

type EtaDistance = Array<{
  distanceText: string;
  eta: string;
}>;

const Location = () => {
  const navigation = useNavigation<any>();
  const [etaDistances, setEtaDistances] = useState<EtaDistance>([]);
  const [currentLocation, setCurrentLocation] = useState<Location>(null);
  const [buildings, setBuildings] = useState<Building>([]);

  useEffect(() => {
    const init = async () => {
      const grantedPermission = await requestLocationPermission();
      if (!grantedPermission) return;

      const buildings = await getBuildings();
      setBuildings(buildings);
      const currentPosition = await getCurrentPosition();
      setCurrentLocation(currentPosition);
      console.log('currentPosition', currentPosition);
      await fetchEtaDistances({
        buildings,
        currentPosition,
      });
    };

    init().catch(err => {
      console.log(err);
    });
  }, []);

  const getBuildings = async () => {
    try {
      const response = await axiosInstance.get<Building>(`/carparkbuilding`);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const getCurrentPosition = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          resolve({
            latitude,
            longitude,
          });
        },
        error => reject(error),
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    });
  };

  const fetchEtaDistances = async ({
    buildings,
    currentPosition,
  }: {
    buildings: Building;
    currentPosition: Location;
  }) => {
    const results: EtaDistance = [];
    console.log('buildings length: ', buildings.length);
    for (const building of buildings) {
      try {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${currentPosition?.latitude},${currentPosition?.longitude}&destination=${building.latitude},${building.longitude}&key=AIzaSyC5SD9ibmsRme7-gSoPKbD83CCznYox76Q`;

        const response = await axios.get(url);

        const {duration, distance} = response.data.routes[0].legs[0];
        const eta = duration.text;
        const distanceText = distance.text;
        results.push({eta, distanceText});
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setEtaDistances(results);
  };

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
