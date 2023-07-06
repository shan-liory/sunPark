import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Box, Text, Button, HStack, VStack, Center, FlatList} from 'native-base';
import {useRoute, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {axiosInstance} from '../api';

type ParkingLot = {
  _id: string;
  name: string;
  isReserved: boolean;
  isAvailable: boolean;
};

const ParkingSession = () => {
  const ipAddress1 = 'http://172.20.10.4:3500';
  const ipAddress2 = 'http://192.168.1.104:3500';

  let selectedIpAddress = ipAddress2;
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [lots, setLots] = useState<Array<ParkingLot>>();
  const [userId, setUserId] = useState('');
  const [QRparkingLot, setQRParkingLot] = useState('');

  useEffect(() => {
    const getParkingLotAndUser = async () => {
      const value = await AsyncStorage.getItem('parkingLot');
      const userId = await AsyncStorage.getItem('id');
      console.log(value);
      if (userId != null) {
        setUserId(userId);
      }
      if (value != null) {
        setQRParkingLot(value);
      }
    };
    getParkingLotAndUser();
  }, []);

  useEffect(() => {
    axiosInstance
      .get(`/parkingLotsStatus`)
      .then(response => {
        setLots(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // console.log(lots);

  const onPressEndSession = async () => {
    await axiosInstance
      .post(`/parkingQrCode/endSession`, {
        parkingLot: route.params.parkedLotName || QRparkingLot,
        userId: userId,
      })
      .then(res => {
        if (res.data.message === 'success') {
          console.log('hehe');
          (async () => {
            await AsyncStorage.setItem('parkingLot', '');
            navigation.replace('QR1');
          })();
        } else {
          console.log('record not found');
        }
      })
      .catch(err => {
        console.error('An error occurred', err.response);
      });
  };

  return (
    // contentContainerStyle flex:1
    <Box bg="#003572" flex={1} alignContent="center">
      <Text fontSize="20" ml={5} fontWeight="bold" mt={5} color="white">
        Parking Lot
      </Text>
      <Box alignItems="center" mt={4}>
        <Text color="white">
          You have parked at lot{' '}
          <Text fontWeight="bold">
            {route.params.parkedLotName || QRparkingLot}
          </Text>
        </Text>
      </Box>
      <FlatList
        contentContainerStyle={{
          padding: 20,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-evenly',
          gap: 10,
        }}
        data={lots}
        renderItem={({item, index}) => {
          return (
            <HStack
              justifyContent={'center'}
              alignItems={'center'}
              style={{
                flex: 0.5,
                marginBottom: 5,
              }}
              backgroundColor={item.isAvailable ? 'gray.200' : '#F79520'}>
              <Text>{item.name}</Text>
            </HStack>
          );
        }}
        keyExtractor={item => item._id}
        numColumns={2} // Set the number of columns to 2
      />
      <Button mt={5} onPress={() => onPressEndSession()}>
        End Session
      </Button>
    </Box>
  );
};

export default ParkingSession;
