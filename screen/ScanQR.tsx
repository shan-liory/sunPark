import React from 'react';
import { NativeBaseProvider, Box, Text } from 'native-base';

const ScanQR = () => {
  return (
    <NativeBaseProvider>
      <Box alignItems="center" bg="#003572" flex={1}>
        <Text fontSize="20" fontWeight="bold" mt={5} color="white">Scan QR Code</Text>
      </Box>
    </NativeBaseProvider>
  );
};

export default ScanQR;