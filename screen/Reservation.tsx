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
  HStack,
  Pressable,
} from 'native-base';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCab, faCircleInfo} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Reservation = () => {
  return (
    <Box bg="#003572" flex={1} alignContent="center">
      <HStack justifyContent={'space-between'} mt={5} mr={5} ml={5}>
        <Text fontSize="20" fontWeight="bold" color="white">
          Reservation
        </Text>
        <FontAwesomeIcon
          icon={faCircleInfo}
          size={30}
          color="white"
          style={{marginTop: 4}}
        />
      </HStack>
        <ScrollView>
        <VStack space="4"  width="90%" alignSelf={"center"} mt={4} mb={10} justifyContent={"space-between"}>
          <Calendar
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              height: 350,
              marginTop: 20,
            }}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: 'orange',
              monthTextColor: 'blue',
              indicatorColor: 'blue',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: 'bold',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: 'bold',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
            // Customize other calendar props as needed
          />
          <Pressable>
            <Box
              p="4"
              borderWidth={1}
              borderRadius={10}
              bg="#F3F3F3"
              borderColor="#F79520">
              <HStack>
                <Image alt="logo" source={require('../asset/car.png')}></Image>
                <VStack>
                  <Text> A1 </Text>
                  <Text fontSize="30" fontWeight="bold" color={'green.700'}>
                    OPEN
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Pressable>
          <Box
            p="4"
            borderWidth={1}
            borderRadius={10}
            bg="#F3F3F3"
            borderColor="#F79520">
            <HStack>
              <Image alt="logo" source={require('../asset/car.png')}></Image>
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
              <Image alt="logo" source={require('../asset/car.png')}></Image>
              <VStack>
                <Text> A1 </Text>
                <Text fontSize="30" fontWeight="bold" color={'green.700'}>
                  OPEN
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
        </ScrollView>
    </Box>
  );
};

export default Reservation;
