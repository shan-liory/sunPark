import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  ScrollView,
  VStack,
  Divider,
  Center,
  HStack,
  Image,
} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCab} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {axiosInstance} from '../api';

const Home = () => {
  const ipAddress1 = 'http://172.20.10.4:3500';
  const ipAddress2 = 'http://192.168.1.104:3500';
  //console.log(Config.REACT_APP_IP_ADDRESS);
  let selectedIpAddress = ipAddress2;
  const [parkingLots, setParkingLots] = useState(0);
  const [availableReserveParking, setAvailableReserveParking] = useState(0);
  const [profileData, setProfileData] = useState({
    id: '',
    name: '-',
    carPlate: 'XX',
    email: 'example@imail.edu.my',
    phone: '01-- --- ----',
    parkingLot: '',
    reservedParkingLot: '',
    pendingReservedParkingLot: '',
  });

  const getData = async () => {
    try {
      const keyValuePair = await AsyncStorage.multiGet([
        'id',
        'name',
        'carPlate',
        'email',
        'phone',
        'parkingLot',
        'reservedParkingLot',
        'pendingReservedParkingLot',
      ]);
      if (keyValuePair !== null) {
        const values = keyValuePair.map(([key, value]) => value);
        const profileValues = values.map(value => value || '');
        const [
          id,
          name,
          carPlate,
          email,
          phone,
          parkingLot,
          reservedParkingLot,
          pendingReservedParkingLot,
        ] = profileValues;
        const profileData = {
          id: id || '',
          name: name || '',
          carPlate: carPlate || '',
          email: email || '',
          phone: phone || '',
          parkingLot: parkingLot || '',
          reservedParkingLot: reservedParkingLot || '',
          pendingReservedParkingLot: pendingReservedParkingLot || '',
        };
        setProfileData(profileData);

        // console.log('profileData(Home)', profileData);
      } else {
        console.log('is null');
      }
    } catch (e) {
      // error reading value
    }
  };

  const getAvailableParkingLots = () => {
    axiosInstance
      .get(`/availableParkingLots`)
      .then(response => {
        // console.log(response.data.length)
        setParkingLots(response.data.length);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const getAvailableReserveParkingLots = () => {
    axiosInstance
      .get(`/availableReserveParkingLots`)
      .then(response => {
        // console.log('availableR', response.data);
        setAvailableReserveParking(response.data.reservedParkingLots.length);
      })
      .catch(error => {
        console.error('Error fetching data (availableR):', error);
      });
  };

  function someFunctions() {
    getAvailableParkingLots();
    getData();
    getAvailableReserveParkingLots();
  }

  useEffect(() => {
    // Run the background data fetching process at a specific interval
    const interval = setInterval(someFunctions, 5000); // Fetch data every 5 seconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

  // const timer = setTimeout(someFunctions, 2000);

  // if (availableReservedParking != 0) {
  //   clearTimeout(timer);
  // }

  return (
    <VStack bg="#003572" flex={1}>
      <Box mt={5}>
        <HStack space={3} justifyContent="space-between" alignItems="center">
          <Text fontSize="20" fontWeight="bold" ml={5} color="white" mb={1}>
            Welcome, {profileData.name}!
          </Text>

          {/* <Box
            alignItems="center"
            mr={5}
            bg="#F3F3F3e"
            p={2}
            borderRadius={50}
            borderWidth={1}
            bgColor="white">
            <FontAwesomeIcon icon={faCab} size={30} color="#F79520" />
          </Box> */}
        </HStack>
      </Box>
      <ScrollView>
        <Center>
          <VStack space="4" width="90%" mt={4} mb={10}>
            <Box
              p="4"
              borderWidth={1}
              borderRadius={10}
              bg="#F3F3F3"
              borderColor="#F79520">
              <VStack>
                <Text>Your Parking Slot: </Text>
                {profileData.parkingLot !== '' ||
                profileData.reservedParkingLot !== '' ? (
                  <Text fontSize={30} fontWeight="bold">
                    {profileData.parkingLot ||
                      profileData.reservedParkingLot ||
                      '--'}
                  </Text>
                ) : (
                  <Text fontSize={30} fontWeight="bold">
                    --
                  </Text>
                )}
              </VStack>
            </Box>
            <Box
              p="4"
              borderWidth={1}
              borderRadius={10}
              bg="#F3F3F3"
              borderColor="#F79520">
              <VStack>
                <Text>Empty Lots in Sunway University Parking: </Text>
                <Text fontSize="100" fontWeight="bold">
                  {parkingLots}{' '}
                </Text>
              </VStack>
            </Box>
            <Box
              borderWidth={1}
              borderRadius={10}
              bg="#F3F3F3"
              borderColor="#F79520">
              <VStack>
                <Text p="4">Available slot for reservation: </Text>
                <HStack>
                  <Text fontSize="100" fontWeight="bold" pl="4">
                    {availableReserveParking}{' '}
                  </Text>
                  <Text fontSize="70" fontWeight="bold" color="grey">
                    of 3
                  </Text>
                </HStack>
                {/* <Box
                  bg="#F79520"
                  borderBottomLeftRadius={10}
                  borderBottomRightRadius={10}
                  alignItems="center">
                  <Text mt={2} fontWeight="bold">
                    Click here to reserve {'>'}
                  </Text>{' '}
                </Box> */}
              </VStack>
            </Box>
          </VStack>
        </Center>
      </ScrollView>
    </VStack>
  );
};

export default Home;
