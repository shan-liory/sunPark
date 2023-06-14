import React, {useState, useEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  ScrollView,
  VStack,
  Image,
  Divider,
  Center,
  HStack
} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCab, faCircleInfo} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Reservation = () => {

    return (
        <Box bg="#003572" flex={1} alignContent="center">
        <HStack justifyContent={"space-between"} mt={5} mr={5}  ml={5}>  
            <Text fontSize="20" fontWeight="bold" color="white">Reservation</Text>
            <FontAwesomeIcon icon={faCircleInfo} size={30} color="white" style={{marginTop: 4}}/> 
        </HStack>
        <Center>
            <VStack space="4" width="90%" mt={4} mb={10}>
              <Box
                p="4"
                borderWidth={1}
                borderRadius={10}
                bg="#F3F3F3"
                borderColor="#F79520">
                <HStack>
                <Image alt="logo" source={require('../asset/car.png')} ></Image>
                <VStack>
                  <Text> A1 </Text>
                  <Text fontSize="30" fontWeight="bold" color={'green.700'}>
                    OPEN
                  </Text>
                </VStack>
                </HStack>
              </Box>
              <Box
                p="4"
                borderWidth={1}
                borderRadius={10}
                bg="#F3F3F3"
                borderColor="#F79520">
                <HStack>
                <Image alt="logo" source={require('../asset/car.png')} ></Image>
                <VStack>
                  <Text> A1 </Text>
                  <Text fontSize="30" fontWeight="bold" color={'green.700'}>
                    OPEN
                  </Text>
                </VStack>
                </HStack>
              </Box>
              <Box
                p="4"
                borderWidth={1}
                borderRadius={10}
                bg="#F3F3F3"
                borderColor="#F79520">
                <HStack>
                <Image alt="logo" source={require('../asset/car.png')} ></Image>
                <VStack>
                  <Text> A1 </Text>
                  <Text fontSize="30" fontWeight="bold" color={'green.700'}>
                    OPEN
                  </Text>
                </VStack>
                </HStack>
              </Box>
            
            </VStack>
          </Center>
        </Box>
        
    )
}

export default Reservation;