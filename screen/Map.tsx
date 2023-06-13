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

const Maps = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  return (
    // contentContainerStyle flex:1
    <Box bg="#003572" flex={1} alignContent="center">
      <Text fontSize="20" ml={5} fontWeight="bold" mt={5} color="white">
        Route
      </Text>
      <Box alignItems="center" mt={4}>
          <Text fontWeight="bold"> maps </Text>
      </Box>
    </Box>
  );
};

export default Maps;
