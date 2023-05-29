import React from 'react';
import { NativeBaseProvider, Box, Text } from 'native-base';

const Location = () => {
  return (
    <NativeBaseProvider>
      <Box alignItems="center">
        <Text>This is Location</Text>
      </Box>
    </NativeBaseProvider>
  );
};

export default Location;