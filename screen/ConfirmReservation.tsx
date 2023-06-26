import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  ScrollView,
  VStack,
  Image,
  Divider,
  Center,
  Button,
  HStack,
  Modal,
  Spinner,
  Pressable,
} from 'native-base';
import {Calendar, LocaleConfig, WeekCalendar} from 'react-native-calendars';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAngleLeft,
  faCab,
  faCircleInfo,
  faTruckMedical,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute, useNavigation} from '@react-navigation/native';
import moment from 'moment';

const ConfirmReservation = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [profileData, setProfileData] = useState({
    name: '',
    carPlate: '',
    email: '',
    phone: '01-- --- ----',
    parkingLot: '',
    reservedParkingLot: '',
    pendingReservedParkingLot: '',
  });

  const getData = async () => {
    try {
      const keyValuePair = await AsyncStorage.multiGet([
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
          name,
          carPlate,
          email,
          phone,
          parkingLot,
          reservedParkingLot,
          pendingReservedParkingLot,
        ] = profileValues;
        const profileData = {
          name: name || '',
          carPlate: carPlate || '',
          email: email || '',
          phone: phone || '',
          parkingLot: parkingLot || '',
          reservedParkingLot: reservedParkingLot || '',
          pendingReservedParkingLot: pendingReservedParkingLot || '',
        };
        setProfileData(profileData);
        setAllReservationDetails({
          studentName: profileData.name,
          studentCarPlate: profileData.carPlate,
          reservedAt: today,
          chosenLot: route.params.object.name,
          chosenLotStatus: 'pending',
        });
        console.log('profileData(cR)', profileData);
        // value previously stored
      } else {
        console.log('is null');
      }
    } catch (e) {
      // error reading value
    }
  };

  const today = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');

  const timer = setTimeout(getData, 2000);

  if (profileData.name != '') {
    clearTimeout(timer);
  }

  const [allReservationDetails, setAllReservationDetails] = useState({
    studentName: '',
    studentCarPlate: '',
    reservedAt: '',
    chosenLot: '',
    chosenLotStatus: '',
  });

  const handleReservation = async () => {
    console.log('pressed');
    await axios
      .post('http://172.20.10.4:3500/reservation', {allReservationDetails})
      .then(response => {
        if (response.data == 'updated') {
          async () => {
            await AsyncStorage.setItem(
              'pendingReservedParkingLot',
              allReservationDetails.chosenLot,
            );
          };
          console.log('updated');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <VStack bg="#003572" flex={1} alignContent="center">
      <Box mt={5} borderBottomColor="#F79520" borderBottomWidth={5} pb={5}>
        <HStack space={3} alignItems="center">
          <Box alignItems="center" bg="#F3F3F3e" p={2}>
            <Pressable onPress={() => navigation.replace('ReservedOptions')}>
              <FontAwesomeIcon icon={faAngleLeft} size={25} color="#F79520" />
              {/* <Text color="#F79520"> Back </Text> */}
            </Pressable>
          </Box>
          <Text fontSize="20" fontWeight="bold" ml={5} color="white">
            Reservation Details
          </Text>
        </HStack>
      </Box>
      <VStack space="4" mt={4} px={4} flex={1} alignItems={'center'}>
        <HStack alignItems={'center'}>
          <Text color={'white'} flex={1}>
            Parking Lot
          </Text>
          <Text color={'white'} flex={1}>
            {route.params.object.name}
          </Text>
        </HStack>
        <HStack alignItems={'center'}>
          <Text color={'white'} flex={1}>
            Car Plate{' '}
          </Text>
          <Text color={'white'} flex={1}>
            {profileData.carPlate}
          </Text>
        </HStack>
        <HStack alignItems={'center'}>
          <Text color={'white'} flex={1}>
            Date{' '}
          </Text>
          <Text color={'white'} flex={1}>
            {today}
          </Text>
        </HStack>
      </VStack>
      <Box flex={1} />
      <Button width="100%" onPress={handleReservation}>
        Confirm Reservation
      </Button>
    </VStack>
  );
};

export default ConfirmReservation;
