import React, {useState} from 'react';
import {NativeBaseProvider, Box, Text, Pressable, Center} from 'native-base';
import axios from 'axios';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

const ScanQR = () => {
 const [isParked,setIsParked] = useState<boolean>(false)
 const [parkedLot, setParkedLot] = useState<string>("")
  const onSuccess = async (e: {data: string}) => {
    try {
      console.log(e.data);
      await axios
        .post('http://192.168.1.102:3500/parkingQrCode/get', {parkingLot: e.data})
        .then(res => {
          if (res.data.message === 'success') {
            setIsParked(true)
            setParkedLot(res.data.lot)
            console.log('scanned' + res.data.lot);
          }
        });
    } catch (err) {
      console.error('An error occurred', err);
    }
  };

  return (
    <NativeBaseProvider>
      <Box bg="#003572" flex={1} alignContent="center">
        <Box alignItems="center" display={isParked ? "none"  : "flex"}>
          <Text fontSize="20" fontWeight="bold" mt={5} color="white">
            Scan QR Code
          </Text>
          <QRCodeScanner
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.off}
            cameraStyle={{width: '90%', marginLeft: 20, marginTop: 100}}
            topContent={
              <Text style={{color: 'white'}}>
                Scan the provided parking QR code.
              </Text>
            }
          />
        </Box>
        <Box alignItems="center" display={isParked ? "flex"  : "none"}>
          <Text mt={5} color="white"> You have parked at {parkedLot} !</Text>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default ScanQR;
