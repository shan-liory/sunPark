import React, {useState} from 'react';
import {
  Box,
  Text,
  Button,
  VStack,
  useToast,
  HStack,
  FormControl,
  Input,
  Center,
  Link,
  Pressable,
  Image,
  Spinner,
} from 'native-base';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DevSettings} from 'react-native';

const Login = () => {
  const navigation = useNavigation<any>();
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const toSignUpScreen = () => {
    console.log('is Clicked');
    navigation.navigate('SignUp', {});
  };

  const submit = async (e: any) => {
    setIsLoading(true);
    console.log('hello', 'isClicked');
    try {
      console.log('form', form);
      await axios
        .post('http://172.20.10.4:3500/login/user', {form})
        //.post('http://192.168.1.111:3500/login/user', {form})
        .then(res => {
          if (form.email == '' || form.password == '') {
            setIsLoading(false);
            toast.show({
              description: 'Please fill in the required field.',
            });
          } else if (res.data.message == 'LoginPass') {
            console.log('res', res.data);
            const itemKey = [
              'name',
              'email',
              'phone',
              'carPlate',
              'parkingLot',
              'reservedParkingLot',
              'pendingReservedParkingLot',
            ];
            const itemValue = [
              res.data.name,
              res.data.email,
              res.data.phone,
              res.data.carPlate,
              res.data.parkingLot,
              res.data.reservedParkingLotId,
              '',
            ];
            (async () => {
              for (let i = 0; i < itemKey.length; i++) {
                await AsyncStorage.setItem(itemKey[i], itemValue[i]);
                console.log(`Item ${itemKey[i]} set successfully.`);
              }
            })();
            navigation.replace('Main', {screen: 'Home'});
            setIsLoading(false);
          } else if (res.data == 'No user') {
            setIsLoading(false);
            toast.show({
              description: 'Email is not registered.',
            });
          } else if (res.data == 'loginFail') {
            setIsLoading(false);
            toast.show({
              description: 'Wrong credentials',
            });
          } else if (res.data == 'fail') {
            setIsLoading(false);
            DevSettings.reload();
            toast.show({
              description: 'Failed, Please check your email/password.',
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };
  // const keys = AsyncStorage.getAllKeys()

  // console.log("storage", keys)

  return (
    <VStack bg="#003572" height="100%">
      <Box alignItems={'center'} p={10}>
        <Image alt="logo" source={require('../asset/logo.png')} size={300} />
        <FormControl isRequired>
          <FormControl.Label mb={2}>Email Address</FormControl.Label>
          <Input
            style={{color: '#ffffff'}}
            placeholder="example@email.com"
            onChangeText={value => setForm({...form, email: value})}
          />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label mt={5} mb={2}>
            Password
          </FormControl.Label>
          <Input
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

          {/* <Link
              _text={{
                fontSize: "xs",
                fontWeight: "500",
                color: "indigo.500",
              }}
              alignSelf="flex-end"
              mt="1"
            >
              Forgot Password?
            </Link> */}
        </FormControl>

        {isLoading ? (
          <Spinner />
        ) : (
          <Button
            mt="10"
            borderRadius="full"
            onPress={submit}
            width={'100%'}
            variant={'solid'}
            _text={{
              color: 'white',
            }}
            backgroundColor={'#F79520'}>
            Log In
          </Button>
        )}

        <Link
          onPress={toSignUpScreen}
          _text={{
            fontSize: 'xs',
            fontWeight: '500',
            color: 'white',
          }}
          alignSelf="center"
          mt="5">
          {' '}
          Don't have an account yet? Here{' '}
        </Link>
      </Box>
    </VStack>
  );
};

export default Login;
