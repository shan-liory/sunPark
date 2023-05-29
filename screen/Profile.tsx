import React from 'react';
import { NativeBaseProvider, Box, Text } from 'native-base';

const Profile = () => {
  return (
    <NativeBaseProvider>
      <Box alignItems="center">
        <Text>This is Profile yo</Text>
      </Box>
    </NativeBaseProvider>
  );
};

export default Profile;