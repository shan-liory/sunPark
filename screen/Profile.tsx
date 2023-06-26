import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  Button,
  VStack,
  ScrollView,
  HStack,
  Center,
  Modal,
  Input,
  FormControl,
  Pressable,
  Spinner,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleRight, faCheck, faEdit} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    carPlate: '',
    email: '',
    phone: '',
    parkingLot: '',
    reservedParkingLot: '',
    pendingReservedParkingLot: '',
  });
  const navigation = useNavigation<any>();
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState({});
  const [openSuccessfulModal, setOpenSuccessfulModal] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState({
    status: false,
    desc: '',
  });
  const [resetPasswordForm, setResetPasswordForm] = useState({
    email: '',
    password: '',
    cpassword: '',
  });

  const goToEditScreen = () => {
    //update user info
    navigation.navigate('EditProfile', {
      profileData,
    });
  };

  const onLogOut = async () => {
    //setItem to empty
    const keys = [
      'name',
      'carPlate',
      'email',
      'phone',
      'level',
      'parkingLot',
      'reservedParkingLot',
      'pendingReservedParkingLot',
    ];
    try {
      await AsyncStorage.multiRemove(keys);
      const testkeys = await AsyncStorage.getAllKeys();
      console.log('auth', testkeys);
      navigation.replace('Main_Auth');
    } catch (e) {
      // remove error
    }
    //check whether has parking session if yes, prompt modal telling end session first
    console.log('Log out');
  };

  const handleChangePassword = async () => {
    console.log(resetPasswordForm);
    if (
      resetPasswordForm.cpassword.length <= 6 ||
      resetPasswordForm.password.length <= 6
    ) {
      setIsError({...isError, name: 'Passwords is too short!'});
    } else if (resetPasswordForm.password != resetPasswordForm.cpassword) {
      setIsError({...isError, name: 'Passwords are not match!'});
    } else {
      await axios
        .post('http://172.20.10.4:3500/user-reset-password', {
          resetPasswordForm,
        })
        // .post('http://192.168.1.111:3500/user-reset-password', {
        //   resetPasswordForm,
        // })
        .then(res => {
          if (res.data == 'same password') {
            setIsError({...isError, name: 'Password is same as the previous.'});
          } else if (res.data.message == 'updatePasswordSuccess') {
            setOpen(false);
            setOpenSuccessfulModal(true);
            console.log('Successfully updated!');
          }
        });
    }
    console.log('change password');
  };
  useEffect(() => {
    if (openSuccessfulModal) {
      const timer = setTimeout(() => {
        setOpenSuccessfulModal(false);
      }, 500); // Close the modal after 3 seconds (adjust the duration as needed)

      return () => clearTimeout(timer); // Clear the timer when the modal is closed or unmounted
    }
  }, [openSuccessfulModal]);

  const getData = async () => {
    try {
      const keyValuePair = await AsyncStorage.multiGet([
        'name',
        'carPlate',
        'email',
        'phone',
        'parkingLot',
        'reservedParkingLot',
      ]);
      if (keyValuePair !== null) {
        const values = keyValuePair.map(([key, value]) => value);
        const profileValues = values.map(value => value || '');
        const [
          name,
          carPlate,
          email,
          phone,
          parkingLot,
          reservedParkingLot,
          pendingReservedParkingLot,
        ] = profileValues;
        const profileData = {
          name: name || '',
          carPlate: carPlate || '',
          email: email || '',
          phone: phone || '',
          parkingLot: parkingLot || '',
          reservedParkingLot: reservedParkingLot || '',
          pendingReservedParkingLot: pendingReservedParkingLot || '',
        };
        // const auth = AsyncStorage.getAllKeys();
        // console.log('auth', auth);
        setProfileData(profileData);
        setResetPasswordForm({
          email: profileData.email,
          password: '',
          cpassword: '',
        });

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
  // setTimeout(getData, 2000);
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

          <Box alignItems="center" bg="#F3F3F3e" p={2}>
            {/* <FontAwesomeIcon icon={faEdit} size={25} color='#F79520' /> */}
            <Pressable onPress={goToEditScreen}>
              <Text color="#F79520"> Edit </Text>
            </Pressable>
          </Box>
        </HStack>
      </Box>
      <VStack space="4" mt={4} pl={4} justifyContent="space-between" flex={1}>
        <Box borderBottomWidth={0.5} borderColor="white">
          <Text color="white" mb={2} fontWeight="semibold">
            Name
          </Text>
          <Text fontSize="15" fontWeight="light" color="white">
            {profileData.name}
          </Text>
        </Box>
        <Box borderBottomWidth={0.5} borderColor="white">
          <Text color="white" mb={2} fontWeight="semibold">
            Email Address
          </Text>
          <Text fontSize="15" fontWeight="light" color="white">
            {profileData.email}
          </Text>
        </Box>
        <Box borderBottomWidth={0.5} borderColor="white">
          <Text color="white" mb={2} fontWeight="semibold">
            Phone Number
          </Text>
          <Text fontSize="15" fontWeight="light" color="white">
            {profileData.phone}
          </Text>
        </Box>
        <Box borderBottomWidth={0.5} borderColor="white">
          <Text color="white" mb={2} fontWeight="semibold">
            Car Plate Number
          </Text>
          <Text fontSize="15" fontWeight="light" color="white">
            {profileData.carPlate}
          </Text>
        </Box>
        <Box flex={1} />
        <Box borderTopWidth={0.5} borderColor="white" py={2}>
          <Pressable
            onPress={() => {
              setOpen(true);
              setIsError({name: ''});
              setIsSuccessful({status: false, desc: ''});
            }}>
            <HStack alignItems={'center'}>
              <Text fontSize="20" color="white">
                Change Password{' '}
              </Text>
              <FontAwesomeIcon icon={faAngleRight} size={30} color="white" />
            </HStack>
          </Pressable>
        </Box>
        <Pressable onPress={onLogOut}>
          <Box borderTopWidth={0.5} borderColor="white" py={2}>
            <Text fontSize="20" color="#F79520">
              Log Out
            </Text>
          </Box>
        </Pressable>
      </VStack>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        safeAreaTop={true}
        _backdrop={{
          _dark: {
            bg: 'coolGray.800',
          },
          bg: 'warmGray.50',
        }}>
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Reset Password</Modal.Header>
          <Modal.Body>
            <FormControl isInvalid={'name' in isError}>
              <Box mb={2}>
                <Text mb={1}>New Password</Text>
                <Input
                  type="password"
                  onChangeText={value =>
                    setResetPasswordForm({
                      ...resetPasswordForm,
                      password: value,
                    })
                  }
                />
              </Box>
              <Box mb={5}>
                <Text mb={1}>Confirm New Password</Text>
                <Input
                  type="password"
                  onChangeText={value =>
                    setResetPasswordForm({
                      ...resetPasswordForm,
                      cpassword: value,
                    })
                  }
                />
                {'name' in isError ? (
                  <FormControl.ErrorMessage>
                    {isError.name}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText>
                    Name should contain at least 6 characters.
                  </FormControl.HelperText>
                )}
              </Box>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group flex={1} justifyContent={'space-between'}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setOpen(false);
                }}>
                Cancel
              </Button>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={handleChangePassword}>
                OK
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={openSuccessfulModal}
        onClose={() => setOpenSuccessfulModal(false)}
        safeAreaTop={true}
        _backdrop={{
          _dark: {
            bg: 'coolGray.800',
          },
          bg: 'warmGray.50',
        }}>
        <Modal.Content maxWidth="350" p={3}>
          <Modal.CloseButton />
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <Box alignItems={'center'}>
              <FontAwesomeIcon icon={faCheck} color="green" />
              <Text>Password updated succesfully!</Text>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </VStack>
  );
};

export default Profile;
