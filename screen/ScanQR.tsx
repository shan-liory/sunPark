import React, {useState, useEffect} from 'react';
import {Box, Text, Pressable, Center, Modal, Button, HStack} from 'native-base';
import axios from 'axios';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleXmark} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanQR = () => {
  const [parkedLot, setParkedLot] = useState({name: '', id: ''});
  const [isValid, setIsValid] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  const navigation = useNavigation<any>();

  const onPress = () => {
    navigation.navigate('ParkingSession', {});
  };

  const onSuccess = (e: {data: string}) => {
    console.log(e.data);
    axios
      //.post('http://192.168.1.111:3500/parkingQrCode/get', {parkingLot: e.data})
      .post('http://172.20.10.4:3500/parkingQrCode/get', {parkingLot: e.data})
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
        }
      });
  };

  return (
    <Box bg="#003572" flex={1} alignContent="center">
      <Text fontSize="20" ml={5} fontWeight="bold" mt={5} color="white">
        Scan QR Code
      </Text>
      <Button onPress={onPress}> here </Button>
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
            <Text>This code is not available.</Text>
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
