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

const SplashScreen = () => {
  return (
    <VStack bg="#003572" flex={1}>
      <Box alignItems={'center'}>
        <Image alt="logo" source={require('../asset/logo.png')} size={200} />
        <Image alt="logo" source={require('../asset/splash.png')} size={400} />
      </Box>
    </VStack>
  );
};

export default SplashScreen;
