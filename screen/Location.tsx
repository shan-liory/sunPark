import React, {useState, useCallback} from 'react';
import {NativeBaseProvider, Box, Text, VStack} from 'native-base';
import {GoogleMap, LoadScript, useJsApiLoader} from '@react-google-maps/api';

const Location = () => {
  const containerStyle = {
    width: '400px',
    height: '400px',
  };

  const center = {
    lat: -3.745,
    lng: -38.523,
  };

  // const {isLoaded, loadError} = useJsApiLoader({
  //   googleMapsApiKey: 'AIzaSyC5SD9ibmsRme7-gSoPKbD83CCznYox76Q',
  // });



  return (
    <NativeBaseProvider>
      <VStack bg="#003572" height="100%">
        <Box mt={5}>
          <Text color="white" fontSize="20" fontWeight="bold" ml={5}>
            Location
          </Text>
        </Box>
        <Box>
          {/* <LoadScript googleMapsApiKey='AIzaSyC5SD9ibmsRme7-gSoPKbD83CCznYox76Q'>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      </GoogleMap>
      </LoadScript>  */}
      </Box>
      </VStack>
    </NativeBaseProvider>
  );
};

export default Location;
