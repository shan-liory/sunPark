import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  FormControl,
  Input,
  useToast,
  Link,
  Spinner,
  Pressable,
  Image,
  ScrollView,
} from 'native-base';
import {TextInput} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
  const ipAddress1 = 'http://172.20.10.4:3500';
  const ipAddress2 = 'http://192.168.1.104:3500';

  let selectedIpAddress = ipAddress2;
  const navigation = useNavigation<any>();
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show2, setShow2] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    cpassword: '',
    carPlate: '',
  });

  const toLoginScreen = () => {
    console.log('is Clicked');
    navigation.navigate('Login', {});
  };

  const submit = async (e: any) => {
    e.preventDefault();

    const validRegex = /[0-9]+@imail\.sunway\.edu\.my/i;
    try {
      if (form.name == '' || form.email == '' || form.carPlate == '') {
        toast.show({
          description: 'Please fill in the required fields.',
        });
      } else if (form.phone.length >= 12 || form.phone.length < 10) {
        toast.show({
          description: 'Please re-enter your phone number.',
        });
      } else if (validRegex.test(form.email) == false) {
        toast.show({
          description: 'Please fill in valid imail address.',
        });
      } else if (form.password.length < 6) {
        toast.show({
          description: 'Password must have at least 6 characters.',
        });
      } else if (form.password != form.cpassword) {
        toast.show({
          description: "Password doesn't match.",
        });
      } else {
        setIsLoading(true);
        await axios
          .post(`${selectedIpAddress}/sign-up/user`, {
            form,
          })
          .then(res => {
            if (res.data == 'exist') {
              toast.show({
                description: 'Email was registered',
              });
            } else if ((res.data.message = 'Not Exist')) {
              //setItem
              AsyncStorage.setItem('id', res.data.id);
              AsyncStorage.setItem('name', res.data.name);
              AsyncStorage.setItem('level', JSON.stringify(res.data.level));
              AsyncStorage.setItem('carPlate', res.data.carPlate);
              AsyncStorage.setItem('email', res.data.email);
              AsyncStorage.setItem('phone', res.data.phone);
              // AsyncStorage.setItem('parkingLotId',res.data.parkingLotId);
              navigation.replace('Main', {});
              console.log('Successfully registered!');
              setIsLoading(false);
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <VStack bg="#003572" height="100%">
      {/* <Image alt="logo" source={require('../asset/logo.png')} size={100} /> */}
      <Box p={5} mt={2}>
        <HStack justifyContent={'space-between'}>
          <Box bg={'#F79520'} height={2} width={2} borderRadius={50}></Box>
          <Box bg={'#F79520'} height={2} width={2} borderRadius={50}></Box>
        </HStack>
        <HStack justifyContent={'space-between'} alignItems={'center'}>
          <Box bg={'#F79520'} height={1.5} flex={1}></Box>
          <Text color={'white'} fontWeight="bold" ml={2} mr={2} fontSize={20}>
            SIGN UP
          </Text>
          <Box bg={'#F79520'} height={1.5} flex={1}></Box>
        </HStack>
      </Box>
      <ScrollView>
        <Box alignItems={'center'} pl={5} pr={5} pt={5}>
          <FormControl isRequired>
            <FormControl.Label>Name</FormControl.Label>
            <Input
              variant="underlined"
              style={{color: '#ffffff'}}
              onChangeText={value => setForm({...form, name: value})}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label mt={5}>Phone Number </FormControl.Label>
            <TextInput
              // variant="underlined"
              keyboardType="number-pad"
              style={{
                color: '#ffffff',
                borderBottomColor: '#ffffff',
                borderBottomWidth: 1,
              }}
              onChangeText={value => setForm({...form, phone: value})}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label mt={5} mb={2}>
              Car Plate Number
            </FormControl.Label>
            <Input
              variant="underlined"
              style={{color: '#ffffff'}}
              placeholder=""
              onChangeText={value => setForm({...form, carPlate: value})}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label mt={5} mb={2}>
              Email Address
            </FormControl.Label>
            <Input
              variant="underlined"
              style={{color: '#ffffff'}}
              placeholder="example@imail.sunway.edu.my"
              onChangeText={value => setForm({...form, email: value})}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label mt={5} mb={2}>
              Password
            </FormControl.Label>
            <Input
              variant="underlined"
              style={{color: '#ffffff'}}
              type={show ? 'text' : 'password'}
              onChangeText={value => setForm({...form, password: value})}
              InputRightElement={
                <Pressable onPress={() => setShow(!show)}>
                  <FontAwesomeIcon
                    icon={show ? faEye : faEyeSlash}
                    size={20}
                    style={{marginRight: 10, color: 'grey'}}
                  />
                </Pressable>
              }
              placeholder="Password"
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label mt={5} mb={2}>
              Confirm Password
            </FormControl.Label>
            <Input
              style={{color: '#ffffff'}}
              variant="underlined"
              type={show2 ? 'text' : 'password'}
              onChangeText={value => setForm({...form, cpassword: value})}
              InputRightElement={
                <Pressable onPress={() => setShow2(!show2)}>
                  <FontAwesomeIcon
                    icon={show2 ? faEye : faEyeSlash}
                    size={20}
                    style={{marginRight: 10, color: 'grey'}}
                  />
                </Pressable>
              }
              placeholder="Confirm Password"
            />
          </FormControl>

          {isLoading ? (
            <Spinner />
          ) : (
            <Button
              mt="10"
              borderRadius="full"
              onPress={submit}
              width={'90%'}
              variant={'solid'}
              _text={{
                color: 'white',
              }}
              backgroundColor={'#F79520'}>
              Sign Up
            </Button>
          )}
          <Text mt="5" color={'white'}>
            Already have an account?
          </Text>

          <Link
            onPress={toLoginScreen}
            mb={3}
            _text={{
              fontSize: 'sm',
              fontWeight: '500',
              color: '#F79520',
            }}>
            Log In
          </Link>
        </Box>
      </ScrollView>
    </VStack>
  );
};

export default SignUp;
