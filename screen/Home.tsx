import React from 'react';
import { NativeBaseProvider, Box, Text } from 'native-base';

const Home = () => {
  return (
    <NativeBaseProvider>
      <Box alignItems="center">
        <Text>This is Home hehehe</Text>
      </Box>
    </NativeBaseProvider>
  );
};

export default Home;