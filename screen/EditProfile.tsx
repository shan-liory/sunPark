import React, {useState} from 'react';
import {
  VStack,
  Text,
  Button,
  Box,
  HStack,
  Pressable,
  Input,
  Modal,
  FormControl,
} from 'native-base';
import {useRoute, useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAngleLeft,
  faArrowLeft,
  faArrowRightArrowLeft,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [editForm, setEditForm] = useState({
    name: route.params.profileData.name,
    phone: route.params.profileData.phone,
    email: route.params.profileData.email,
    carPlate: route.params.profileData.carPlate,
  });

  const testEdit = async () => {
    await AsyncStorage.setItem('phone', '0121234567');
    navigation.replace('Main', {screen: 'Profile'});
  };
  const handleEditInfo = async (e: any) => {
    console.log('clicked');
    try {
      await axios
        .post('http://172.20.10.4:3500/update-user-info', {
          editForm,
        })
        // .post('http://192.168.1.111:3500/update-user-info', {
        //   editForm,
        // })
        .then(res => {
          if (res.data.message === 'updateCarParkSuccess') {
            console.log('can save');
            setIsSuccessful(true);
            (async () => {
              await AsyncStorage.setItem('name', editForm.name);
              await AsyncStorage.setItem('carPlate', editForm.carPlate);
              await AsyncStorage.setItem('phone', editForm.phone);
              navigation.replace('Main', {screen: 'Profile'});
            })();
          }
        })
        .catch(e => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <VStack bg="#003572" height="100%">
      <Box mt={5} borderBottomColor="#F79520" borderBottomWidth={5} pb={5}>
        <HStack space={3} justifyContent="space-between" alignItems="center">
          <Box alignItems="center" bg="#F3F3F3e" p={2}>
            <Pressable onPress={() => navigation.goBack()}>
              <FontAwesomeIcon icon={faAngleLeft} size={25} color="#F79520" />
              {/* <Text color="#F79520"> Back </Text> */}
            </Pressable>
          </Box>
          <Text fontSize="20" fontWeight="bold" ml={5} color="white">
            Edit Profile
          </Text>

          <Box alignItems="center" bg="#F3F3F3e" p={2}>
            <Pressable onPress={handleEditInfo}>
              {/* <FontAwesomeIcon icon={faCheck} size={25} color="#F79520" /> */}
              <Text color="#F79520"> Save </Text>
            </Pressable>
          </Box>
        </HStack>
      </Box>
      {/* <Button onPress={() => navigation.goBack()}>GO back</Button> */}
      <VStack space="4" mt={4} px={4} flex={1} alignItems={'center'}>
        <HStack alignItems={'center'}>
          <Text color={'white'} flex={1}>
            Name
          </Text>
          <Input
            style={{color: '#ffffff'}}
            variant="underlined"
            onChangeText={value => setEditForm({...editForm, name: value})}
            value={editForm.name}
            flex={1}
          />
        </HStack>
        <HStack alignItems={'center'}>
          <Text color={'white'} flex={1}>
            Car Plate{' '}
          </Text>
          <Input
            style={{color: '#ffffff'}}
            variant="underlined"
            onChangeText={value => setEditForm({...editForm, carPlate: value})}
            value={editForm.carPlate}
            flex={1}
          />
        </HStack>
        <HStack alignItems={'center'}>
          <Text color={'white'} flex={1}>
            Phone Number{' '}
          </Text>
          <Input
            style={{color: '#ffffff'}}
            variant="underlined"
            onChangeText={value => setEditForm({...editForm, phone: value})}
            value={editForm.phone}
            flex={1}
          />
        </HStack>
        <Box flex={1} />
        <Box
          mt={5}
          bgColor={'grey'}
          p={2}
          borderRadius={20}
          display={isSuccessful ? 'flex' : 'none'}>
          <HStack>
            <FontAwesomeIcon icon={faCheck} size={25} color="green" />
            <Text color="white">Profile Updated Successfully!</Text>
          </HStack>
        </Box>
        <Box flex={1} />
      </VStack>
    </VStack>
  );
};

export default EditProfile;
