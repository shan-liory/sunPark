import React, {useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Button,
  VStack,
  HStack,
  FormControl,
  Input,
  Center,
  Link,
  Pressable,
  Image,
} from 'native-base';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
  const navigation = useNavigation<any>();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const onPress = () => {
    console.log("sign Up")

   }

   const toLoginScreen = () => {
    console.log("is Clicked")
    navigation.navigate('Login', {
    });
   }

  const submit = () => {
    console.log("hello", "isClicked")
    // try{
    //   await axios.post("http://172.20.10.4:3500/login/user",{
    //     form
    //   })
    //   .then(res =>{
    //     if (res.data.message == "LoginPass"){
    //     //   localStorage.setItem('username',res.data.username);
    //     //   localStorage.setItem('level',res.data.level);
    //       navigation.navigate("Home")
    //     }
    //     else if (res.data == "No user"){
    //     //   toast.error("Email is not registered.")
    //     }
    //     else if (res.data == "loginFail"){
    //     //   toast.error("Wrong Credentials");
    //     }
    //     else if (res.data == "fail"){
    //     //   toast.error("Something is wrong!");
    //     }
    //   })
    //   .catch(e => {
    //     console.log(e)
    //   })
    // }
    // catch(e){
    //   console.log(e)
    // }
  }

  return (
    <VStack bg="#003572" height="100%">
        <Box alignItems={"center"} p={10}> 
        <Image alt="logo" source={require('../asset/logo.png')} size={100} />
          <FormControl isRequired  >
            <FormControl.Label mb={2} >Email ID</FormControl.Label>
            <Input
             style={{ color: '#ffffff' }}
              placeholder="example@email.com"
              onChangeText={(value) => setForm({ ...form, email: value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormControl.Label mt={5} mb={2}>Password</FormControl.Label>
            <Input
             style={{ color: '#ffffff' }}
              type={show ? "text" : "password"} onChangeText={value => setForm({...form, password:value})}
              InputRightElement={
                <Pressable onPress={() => setShow(!show)}>
                  <FontAwesomeIcon icon={show ? faEye : faEyeSlash} size={20} style={{ marginRight: 10, color: 'grey' }}
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
          <Button mt="10" colorScheme={"indigo"} onPress={onPress}>
            Sign Up
          </Button>
          <Text mt="5" color={"indigo.500"}>Already have an account?</Text>

          <Link onPress={toLoginScreen}
          _text={{
                fontSize: "xs",
                fontWeight: "500",
                color: "indigo.500",
              }}
              >Sign In </Link>
          </Box>
    </VStack>
    
  );
};

export default SignUp;
