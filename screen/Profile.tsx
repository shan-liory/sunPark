import React, {useState} from 'react';
import {
  Box,
  Text,
  Button,
  VStack,
  ScrollView,
  HStack,
  Center,
  Pressable,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    carPlate: '',
    email: '',
    phone: '',
  });
  const navigation = useNavigation<any>();

  const goToEditScreen = () => {
    //update user info
    navigation.navigate('EditProfile', {
      profileData,
    });
  };

  const onLogOut = () => {
    navigation.navigate('auth');
    //setItem to empty
    const keys = ['name', 'carPlate', 'email', 'phone'];
    try {
      AsyncStorage.multiRemove(keys);
    } catch (e) {
      // remove error
    }
    console.log('Done.');
    //check whether has parking session if yes, prompt modal telling end session first
    console.log('Log out');
  };

  const changePassword = () => {
    console.log('change password');
  };

  const getData = async () => {
    console.log('data', 'data');
    try {
      const keyValuePair = await AsyncStorage.multiGet([
        'name',
        'carPlate',
        'email',
        'phone',
      ]);
      if (keyValuePair !== null) {
        const values = keyValuePair.map(([key, value]) => value);
        const profileValues = values.map(value => value || '');
        const [name, carPlate, email, phone] = profileValues;
        const profileData = {
          name: name || '',
          carPlate: carPlate || '',
          email: email || '',
          phone: phone || '',
        };
        const auth = AsyncStorage.getItem('email');
        console.log('auth', auth);
        setProfileData(profileData);

        console.log('profileData(Profile)', profileData);
        // value previously stored
      } else {
        console.log('is null');
      }
    } catch (e) {
      // error reading value
    }
  };

  const timer = setTimeout(getData, 2000);

  if (profileData.name !== '') {
    clearTimeout(timer);
  }

  return (
    <VStack bg="#003572" height="100%">
      <Box mt={5} borderBottomColor="#F79520" borderBottomWidth={5} pb={5}>
        <HStack space={3} justifyContent="space-between" alignItems="center">
          <Text fontSize="20" fontWeight="bold" ml={5} color="white">
            My Profile
          </Text>

          <Box alignItems="center" mr={5} bg="#F3F3F3e" p={2}>
            {/* <FontAwesomeIcon icon={faEdit} size={25} color='#F79520' /> */}
            <Pressable onPress={goToEditScreen}>
              <Text color="#F79520"> Edit </Text>
            </Pressable>
          </Box>
        </HStack>
      </Box>
      <VStack space="4" mt={4} pl={3} justifyContent="space-between" flex={1}>
        <Box borderBottomWidth={1} borderColor="white">
          <Text color="white" mb={2}>
            {' '}
            Name{' '}
          </Text>
          <Text fontSize="20" fontWeight="bold" color="white">
            {' '}
            {profileData.name}{' '}
          </Text>
        </Box>
        <Box borderBottomWidth={1} borderColor="white">
          <Text color="white" mb={2}>
            Email Address{' '}
          </Text>
          <Text fontSize="20" fontWeight="bold" color="white">
            {' '}
            {profileData.email}
          </Text>
        </Box>
        <Box borderBottomWidth={1} borderColor="white">
          <Text color="white" mb={2}>
            Phone Number
          </Text>
          <Text fontSize="20" fontWeight="bold" color="white">
            {' '}
            {profileData.phone}{' '}
          </Text>
        </Box>
        <Box borderBottomWidth={1} borderColor="white">
          <Text color="white" mb={2}>
            Car Plate Number
          </Text>
          <Text fontSize="20" fontWeight="bold" color="white">
            {' '}
            {profileData.carPlate}{' '}
          </Text>
        </Box>
        <Box flex={1} />
        <Pressable onPress={changePassword}>
          <Box borderTopWidth={1} borderColor="white" height={50} py={2}>
            <Text fontSize="20" color="white">
              Change Password {'>'}
            </Text>
          </Box>
        </Pressable>
        <Pressable onPress={onLogOut}>
          <Box borderTopWidth={1} borderColor="white" height={60} py={2}>
            <Text fontSize="20" color="#F79520">
              Log Out
            </Text>
          </Box>
        </Pressable>
      </VStack>
    </VStack>
  );
};

export default Profile;
