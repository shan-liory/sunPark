import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  Pressable,
  Center,
  Modal,
  Button,
  HStack,
  VStack,
} from 'native-base';
import axios from 'axios';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleXmark} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {axiosInstance} from '../api';

const ScanQR = () => {
  const ipAddress1 = 'http://172.20.10.4:3500';
  const ipAddress2 = 'http://192.168.1.104:3500';

  let selectedIpAddress = ipAddress2;
  const [parkedLot, setParkedLot] = useState({name: '', id: ''});
  const [isValid, setIsValid] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [allowScan, setAllowScan] = useState(true);
  const [showPendingMessage, setShowPendingMessage] = useState(false);

  const navigation = useNavigation<any>();

  const toParkingSession = async () => {
    const value = await AsyncStorage.getItem('parkingLot');
    if (value != null) {
      navigation.replace('ParkingSession', {});
    }
  };

  const onSuccess = async (e: {data: string}) => {
    console.log(e.data);
    const user = await AsyncStorage.getItem('id');
    axiosInstance
      .post(`/parkingQrCode/get`, {
        parkingLot: e.data,
        userId: user,
      })
      .then(res => {
        if (res.data.message === 'success') {
          console.log('success');
          //setItem --> parkingLot
          AsyncStorage.setItem('parkingLot', res.data.lot);
          navigation.navigate('ParkingSession', {
            parkedLotId: e.data,
            parkedLotName: res.data.lot,
          });
        }
        if (res.data.message === 'occupied') {
          setIsModal2Open(true);
        } else {
          console.log('record not found');
          setIsValid(false);
        }
      })
      .catch(err => {
        // console.error('An error occurred', err.response.status);
        if (err && err.response.status === 400) {
          setOpen(true);
        } else {
          console.log('An error occurred', err.response);
          setOpen(true);
        }
      });
  };

  const hasPending = async () => {
    const check = await AsyncStorage.getItem('pendingReservedParkingLot');
    const checkReserve = await AsyncStorage.getItem('reservedParkingLot');
    console.log(check, checkReserve);
    if (check != null && checkReserve == null) {
      setAllowScan(false);
      setShowPendingMessage(true);
    }
    if (checkReserve != null && check == null) {
      console.log('here');
      setShowPendingMessage(false);
      setAllowScan(false);
    }
    if (checkReserve == null && check == null) {
      setAllowScan(true);
    }

    console.log(allowScan, showPendingMessage);
  };

  toParkingSession();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', hasPending);
    console.log(allowScan, showPendingMessage);
    // Cleanup the listener when the component unmounts or the screen loses focus
    return () => {
      unsubscribe();
    };
  }, [allowScan, showPendingMessage]);

  return (
    <Box bg="#003572" flex={1} alignContent="center">
      <Text fontSize="20" ml={5} fontWeight="bold" mt={5} color="white">
        Scan QR Code
      </Text>
      {/* <Button onPress={onPress}> here </Button> */}
      {!allowScan ? (
        showPendingMessage ? (
          <Box alignSelf="center" width="90%">
            <VStack space={4}>
              <Text color="white" mt={3} fontSize="12" fontWeight="bold">
                You have a pending reservation request.
              </Text>
              <Text
                color="white"
                mb={3}
                fontSize="12"
                fontWeight="bold"
                textAlign={'justify'}>
                In order to initiate the QR parking session, please cancel your
                previous reservation request if you would like to scan the QR
                code.
              </Text>
              {/* <Button></Button> */}
            </VStack>
          </Box>
        ) : (
          <Box alignSelf="center" width="90%">
            <VStack space={4}>
              <Text color="white" mt={3} fontSize="12" fontWeight="bold">
                You have a reserved parking lot!
              </Text>
              <Text
                color="white"
                mb={3}
                fontSize="12"
                fontWeight="bold"
                textAlign={'justify'}>
                Please proceed to your reserved parking lot.
              </Text>
              {/* <Button>Click here to navigate to Reservation page</Button> */}
            </VStack>
          </Box>
        )
      ) : (
        <Box alignItems="center">
          <Text color="white" mt={3} fontSize="12">
            Scan parking QR code here.
          </Text>
          <QRCodeScanner
            onRead={onSuccess}
            reactivateTimeout={3000}
            reactivate={true}
            flashMode={RNCamera.Constants.FlashMode.off}
            cameraStyle={{width: '90%', marginLeft: 20, marginTop: 50}}
          />
        </Box>
      )}
      <Modal isOpen={open} onClose={() => setOpen(false)} safeAreaTop={true}>
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Invalid QR code</Modal.Header>
          <Modal.Body>
            <Text>Try another QR code</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setOpen(false);
                }}>
                OK
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={isModal2Open}
        onClose={() => setIsModal2Open(false)}
        safeAreaTop={true}>
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>
            <HStack>
              <FontAwesomeIcon icon={faCircleXmark} color="red" size={28} />
              <Text fontWeight="bold"> Oops!</Text>
            </HStack>
          </Modal.Header>
          <Modal.Body>
            <Text mb={1}>This parking lot is not available.</Text>
            <Text>Please scan another valid QR code.</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group>
              <Button
                colorScheme="gray"
                onPress={() => {
                  setIsModal2Open(false);
                }}>
                OK
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default ScanQR;
