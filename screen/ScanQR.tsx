import React, { useState } from 'react';
import { NativeBaseProvider, Box, Text,Pressable,Center } from 'native-base';
import axios from "axios"
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

// interface parkingLot {
//   id: string;
// }

// const [parkingLot,setParkingLot] = useState<parkingLot>({
//   id:''
// })

const onSuccess = async (e: string) => {
  try{
    await axios
    .post("http://172.20.10.4:3500/parkingQrCode/get",
      {parkingLot:e}
    )
    .then((res) => {
      if (res.data.message === "success") {
        console.log("scanned");
      }
    })
    // .catch((err) => {
    //   console.log(err);
    // });
  }
  catch (err) {
    console.error('An error occurred', err)
  }
};


const ScanQR = () => {
  return (
    <NativeBaseProvider>
      <Box alignItems="center" bg="#003572" flex={1}>
      {/* flashMode={RNCamera.Constants.FlashMode.torch} */}
        <Text fontSize="20" fontWeight="bold" mt={5} color="white">Scan QR Code</Text>
        {/* <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.off}
        cameraStyle={{width:"90%", marginLeft:20, marginTop:5}}
        topContent={
          <Text style={{color:"white"}}>
           Scan the provided parking QR code.
          </Text>
        }
        bottomContent={
         
        }
        /> */}
         <Pressable onPress={() => onSuccess("647552b1c7f26f936ac45fad")}>
          <Text>OK. Got it!</Text>
           </Pressable>
      </Box>
    </NativeBaseProvider>
  );
};

export default ScanQR;