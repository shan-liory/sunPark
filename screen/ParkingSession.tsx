import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  NativeBaseProvider,
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Center,
  FlatList,
} from 'native-base';
import {useRoute, useNavigation} from '@react-navigation/native';

type ParkingLot = {
  _id: string;
  name: string;
  isReserved: boolean;
  isAvailable: boolean;
};

const parkingLots: Array<ParkingLot> = [
  {
    _id: 'A1',
    name: 'A1',
    isReserved: false,
    isAvailable: true,
  },
  {
    _id: 'A2',
    name: 'A2',
    isReserved: false,
    isAvailable: true,
  },
  {
    _id: 'A3',
    name: 'A3',
    isReserved: false,
    isAvailable: true,
  },
  {
    _id: 'A4',
    name: 'A4',
    isReserved: false,
    isAvailable: true,
  },
  {
    _id: 'A5',
    name: 'A5',
    isReserved: false,
    isAvailable: true,
  },
  {
    _id: 'A6',
    name: 'A6',
    isReserved: false,
    isAvailable: true,
  },
  {
    _id: 'A7',
    name: 'A7',
    isReserved: false,
    isAvailable: true,
  },
  {
    _id: 'A8',
    name: 'A8',
    isReserved: false,
    isAvailable: false,
  },
  {
    _id: 'A9',
    name: 'A9',
    isReserved: false,
    isAvailable: true,
  },
  {
    _id: 'A10',
    name: 'A10',
    isReserved: false,
    isAvailable: true,
  },
];

const ParkingSession = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const [lots, setLots] = useState<Array<ParkingLot>>();
  useEffect(() => {
    axios
      // .get('http://192.168.1.110:3500/parkingLotsStatus')
      .get('http://172.20.10.4:3500/parkingLotsStatus')
      .then(response => {
        setLots(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  console.log(lots)

  const onPressEndSession = () => {
    axios
      // .post('http://192.168.1.110:3500/parkingQrCode/endSession', {
      //   parkingLot: route.params.parkedLotId,
      // })
      .post('http://172.20.10.4:3500/parkingQrCode/endSession', {
        parkingLot: route.params.parkedLotId,
      })
      .then(res => {
        if (res.data.message === 'success') {
          console.log('hehe');
          navigation.goBack();
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
          <Text fontWeight="bold">{route.params.parkedLotName}</Text>
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

{
  /* <Box>
  {
    parkingLots.map(parkingLot => {

    })
  }
</Box> */
}
