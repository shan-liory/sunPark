import React , { useState } from 'react';
import { NativeBaseProvider, Box, Text,Button,VStack,ScrollView,HStack, Center,Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';




const Profile = () => {
  const [userName, setUserName] = useState('AboutReact');
  const navigation = useNavigation<any>();

  const goToEditScreen = () => {
    navigation.navigate('EditProfile', {
      userName,
    });
  };

  const onLogOut = () =>{
    console.log("Log out")
  }
  

  return (
    <NativeBaseProvider>
      <VStack  bg="#003572" height="100%">
      <Box mt={5} borderBottomColor="#F79520" borderBottomWidth={5} pb={5}>
        <HStack  space={3} justifyContent="space-between" alignItems="center" >
        <Text fontSize="20" fontWeight="bold" ml={5} color="white">My Profile</Text>
    
        <Box alignItems="center" mr={5} bg="#F3F3F3e" p={2}> 
        {/* <FontAwesomeIcon icon={faEdit} size={25} color='#F79520' /> */}
        <Pressable onPress={goToEditScreen}>
        <Text color='#F79520'> Edit </Text>
        </Pressable>
        </Box>
        </HStack>
      </Box>
      <ScrollView>
        <Center>
        <VStack space="4" width="90%" mt={4} justifyContent="space-between" flex={1}>
       
        <VStack borderBottomWidth={1} borderColor="white" >
         <Text color="white">First Name </Text>
         <Text fontSize="30" fontWeight="bold" color="white"> XX </Text>
         </VStack>
         <VStack borderBottomWidth={1} borderColor="white" >
         <Text color="white">Last Name </Text>
         <Text fontSize="30" fontWeight="bold" color="white"> XX </Text>
         </VStack>
         <VStack borderBottomWidth={1} borderColor="white" >
         <Text color="white">Email </Text>
         <Text fontSize="30" fontWeight="bold" color="white"> XX </Text>
         </VStack>
         <VStack borderBottomWidth={1} borderColor="white" >
         <Text color="white">Phone Number</Text>
         <Text fontSize="30" fontWeight="bold" color="white"> XX </Text>
         </VStack>
         <VStack borderBottomWidth={1} borderColor="white" >
         <Text color="white">Car Plate Number</Text>
         <Text fontSize="30" fontWeight="bold" color="white"> XX </Text>
         </VStack>
         <VStack borderBottomWidth={1} borderTopWidth={1} borderColor="white" mt={20} pb={2} pt={2}>
         <Text fontSize="20" color="white">Change Password {'>'}</Text>
         </VStack>
         <Pressable onPress={onLogOut}>
         <VStack borderColor="white" mb={3}>
         <Text fontSize="20" color="#F79520">Log Out </Text>
         </VStack>
         </Pressable>
        </VStack>
        </Center>
      </ScrollView>
      </VStack>
    </NativeBaseProvider>
  );
};

export default Profile;