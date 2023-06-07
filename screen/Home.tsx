import React, {useState, useEffect} from 'react';
import {
  NativeBaseProvider,
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

const Home = () => {
  const [parkingLots, setParkingLots] = useState(0);

  setInterval(() => {
      axios
        .get('http://172.20.10.4:3500/parkingLots')
        .then(response => {
          // console.log(response.data.length)
          setParkingLots(response.data.length);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }, 2000);

  return (
    <NativeBaseProvider>
      <VStack bg="#003572" height="100%">
        <Box mt={5}>
          <HStack space={3} justifyContent="space-between" alignItems="center">
            <Text fontSize="20" fontWeight="bold" ml={5} color="white">
              Hi, Shan!
            </Text>

            <Box
              alignItems="center"
              mr={5}
              bg="#F3F3F3e"
              p={2}
              borderRadius={50}
              borderWidth={1}
              bgColor="white">
              <FontAwesomeIcon icon={faCab} size={30} color="#F79520" />
            </Box>
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
                  <Text fontSize="30" fontWeight="bold">
                    --{' '}
                  </Text>
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
                      1{' '}
                    </Text>
                    <Text fontSize="70" fontWeight="bold" color="grey">
                      of 3
                    </Text>
                  </HStack>
                  <Box
                    bg="#F79520"
                    borderBottomLeftRadius={10}
                    borderBottomRightRadius={10}
                    alignItems="center">
                    <Text mt={2} fontWeight="bold">
                      Click here to reserve {'>'}
                    </Text>{' '}
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Center>
        </ScrollView>
      </VStack>
    </NativeBaseProvider>
  );
};

export default Home;
