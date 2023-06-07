import React from 'react';
import axios from 'axios';
import {
  NativeBaseProvider,
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Center,
} from 'native-base';
import {useRoute, useNavigation} from '@react-navigation/native';

const ParkingSession = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const numColumns = 2;
  const numRows = 5;

  // const boxArray = Array(numColumns * numRows).fill(null);
  console.log(Array(numRows));

  const onPressEndSession = () => {
    axios
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
    <NativeBaseProvider>
      <Box bg="#003572" flex={1} alignContent="center">
        <Text fontSize="20" ml={5} fontWeight="bold" mt={5} color="white">
          Parking Lot
        </Text>
        <Box alignItems="center" mt={4}>
          <Text color="white">
            You have parked at lot{' '}
            <Text fontWeight="bold">{route.params.parkedLotName}</Text>
          </Text>
          <Box width="90%" mt={2}>
            {/* <HStack space={2}>
              <VStack  flex={1}>
                <Box height="100" backgroundColor="red.200" mb={2} pr={2} alignItems="flex-end"><Center> </Center>A1</Box>
                <Box height="100" backgroundColor="blue.200" mb={2} pr={2} alignItems="flex-end"><Center> </Center>A2</Box>
                <Box height="100" backgroundColor="green.200" mb={2} pr={2} alignItems="flex-end"><Center> </Center>A3</Box>
                <Box height="100" backgroundColor="yellow.200" mb={2} pr={2} alignItems="flex-end"><Center> </Center>A4</Box>
                <Box height="100" backgroundColor="purple.200" mb={2} pr={2} alignItems="flex-end"><Center> </Center>A5</Box>
              </VStack>
              <VStack  flex={1}>
                <Box height="100" backgroundColor="orange.200" mb={2} pr={2} alignItems="flex-end"><Center> </Center>A6</Box>
                <Box height="100" backgroundColor="pink.200" mb={2} pr={2} alignItems="flex-end"><Center> </Center>A7</Box>
                <Box height="100" backgroundColor="teal.200" mb={2} pr={2} alignItems="flex-end"><Center> </Center>A8</Box>
                <Box height="100" backgroundColor="gray.200" mb={2} pr={2} alignItems="flex-end"><Center> </Center>A9</Box>
                <Box height="100" backgroundColor="cyan.200" mb={2} pr={2} alignItems="flex-end"><Center> </Center>A10</Box>
              </VStack>
            </HStack> */}

            <HStack space={2}>
              {Array(numColumns)
                .fill(null)
                .map((_, columnIndex) => (
                  <VStack key={columnIndex} flex={1} height="500">
                    {Array(numRows)
                      .fill(null)
                      .map((_, rowIndex) => (
                        <Box
                          key={`${columnIndex}-${rowIndex}`}
                          flex={1}
                          height="100"
                          backgroundColor="gray.200"
                          mb={1}
                          alignItems="flex-end"
                          pr={1}>
                          {' '}
                          <HStack><Text>A{columnIndex}</Text></HStack>
                        </Box>
                      ))}
                  </VStack>
                ))}
            </HStack>
          </Box>
          <Button mt={5} onPress={() => onPressEndSession()}>
            End Session
          </Button>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default ParkingSession;
