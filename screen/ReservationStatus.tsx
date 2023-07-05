import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  ScrollView,
  VStack,
  Image,
  Divider,
  Center,
  Button,
  HStack,
  Modal,
  Spinner,
  Pressable,
} from 'native-base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute, useNavigation} from '@react-navigation/native';

const ReservationStatus = () => {
  const ipAddress1 = 'http://172.20.10.4:3500';
  const ipAddress2 = 'http://192.168.1.104:3500';

  let selectedIpAddress = ipAddress2;
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [pending, setPending] = useState(true);
  const [rejectMessage, setRejectMessage] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [rLot, setRLot] = useState('');

  const getReservationStatus = async () => {
    const value = await AsyncStorage.getItem('id');
    const value2 = await AsyncStorage.getItem('pendingReservedParkingLot');
    const value3 = await AsyncStorage.getItem('reservedParkingLot');
    console.log('getReservationStatus', value, value2);
    try {
      await axios
        .get(`${selectedIpAddress}/retrieveUserReservationStatus`, {
          params: {
            value: value,
          },
        })
        .then(response => {
          //console.log('status');
          if (response.data.message == 'APPROVED') {
            console.log('approved');
            (async () => {
              await AsyncStorage.setItem('pendingReservedParkingLot', '');
              await AsyncStorage.setItem(
                'reservedParkingLot',
                response.data.data,
              );
              setRLot(response.data.data);
            })();
            setIsApproved(true);
            setPending(false);
          } else if (response.data.message == 'rejected') {
            console.log('rejected');
            (async () => {
              await AsyncStorage.setItem('pendingReservedParkingLot', '');
            })();
            console.log(response.data.data);
            setRejectMessage(response.data.data.rejectReason);
            setIsApproved(false);
            setPending(false);
          }
          // console.log(response.data.message);
        })
        .catch(error => {
          console.log('pendingR', error);
        });
    } catch (error) {
      console.log(error);
    }

    console.log('RS', isApproved, pending);
  };

  //   const getStatus = async () => {
  //     const pendingValue = await AsyncStorage.getItem(
  //       'pendingReservedParkingLot',
  //     );
  //     const reservedLot = await AsyncStorage.getItem('reservedParkingLot');
  //     console.log('getStatus', pendingValue, reservedLot);
  //     if (pendingValue == null && reservedLot != null) {
  //       setIsApproved(true);
  //       setPending(false);
  //     }
  //   };

  //   const data = route.params.allReservationDetails;
  //   console.log('st', data);

  const onCancel = async () => {
    console.log('clicked cancel');
    const pRLot = await AsyncStorage.getItem('pendingReservedParkingLot');
    const id = await AsyncStorage.getItem('id');
    console.log(pRLot, id);
    try {
      await axios
        .post(`${selectedIpAddress}/cancelReservation`, {
          lot: pRLot,
          userId: id,
        })
        .then(response => {
          if (response.data.message == 'cancelled') {
            (async () => {
              await AsyncStorage.setItem('pendingReservedParkingLot', '');
            })();
            setIsButtonDisabled(true);
            navigation.navigate('ReservedOptions');
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const delay = 10000; // Delay in milliseconds

  const executeWithCondition = async () => {
    const reservedLot = await AsyncStorage.getItem('reservedParkingLot');
    console.log(reservedLot);
    if (reservedLot == null) {
      setTimeout(getReservationStatus, delay);
    } else {
      setRLot(reservedLot);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getReservationStatus);
    setInterval(getReservationStatus, 10000);
    // Cleanup the listener when the component unmounts or the screen loses focus
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <VStack bg="#003572" flex={1} alignContent="center">
        <Box mt={5} borderBottomColor="#F79520" borderBottomWidth={5} pb={5}>
          {/* <HStack space={3} alignItems="center">
          <Box alignItems="center" bg="#F3F3F3e" p={2}>
            <FontAwesomeIcon icon={faAngleLeft} size={25} color="#F79520" /> 
            <Text color="#F79520"> Back </Text> 
          </Box>
        </HStack> */}
          <Text fontSize="20" fontWeight="bold" ml={5} color="white">
            Reservation Status
          </Text>
        </Box>
        {pending ? (
          <VStack space="4" width="90%" alignItems={'center'} mt={4} mb={10}>
            <Text
              fontWeight="bold"
              color="white"
              justifyContent={'space-between'}>
              You have a pending reservation! Kindly wait for the administrator
              to review your reservation request.
            </Text>
            <Box flex={1}></Box>
            <Button onPress={onCancel} isDisabled={isButtonDisabled}>
              Cancel Reservation
            </Button>
          </VStack>
        ) : (
          <VStack space="4" width="90%" alignItems={'center'} mt={4} mb={10}>
            <Box display={isApproved ? 'flex' : 'none'} alignItems={'center'}>
              <Text fontWeight="bold" color="white">
                Your reserved has been
              </Text>
              <Text color="green.300" mt={3} mb={3}>
                APPROVED!
              </Text>
              <Text fontWeight="bold" color="white">
                Your reserved parking lot is {rLot}
              </Text>
              <Box flex={1}></Box>
            </Box>
            <Box display={isApproved ? 'none' : 'flex'} alignItems={'center'}>
              <Text fontWeight="bold" color="white" mb={3}>
                Your reserved has been rejected!
              </Text>
              <Text fontWeight="bold" color="white">
                Reject reason from the administrator:
              </Text>
              <Text fontWeight="bold" color="#F79520">
                {rejectMessage}
              </Text>
              <Box flex={1}></Box>
            </Box>
          </VStack>
        )}
      </VStack>
    </>
  );
};

export default ReservationStatus;
