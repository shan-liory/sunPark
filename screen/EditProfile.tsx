import React from 'react';
import { NativeBaseProvider, Box, Text,Button } from 'native-base';
import { useRoute,useNavigation } from '@react-navigation/native';

const EditProfile = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
  return (
    <NativeBaseProvider>
      <Box alignItems="center">
        <Text>This is Edit Profile</Text>
        <Button onPress={() => navigation.goBack()}>GO back</Button>
        <Text>{route.params.userName}</Text>
      </Box>
    </NativeBaseProvider>
  );
};

export default EditProfile;