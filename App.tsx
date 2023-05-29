import React from 'react';
import type {PropsWithChildren} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screen/Home';
import Location from './screen/Location';
import Profile from './screen/Profile';
import ScanQR from './screen/ScanQR';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeBaseProvider, Box, Text } from 'native-base';
import { faHome,faQrcode,faLocationPin,faUser,faBell,faSearch } from '@fortawesome/free-solid-svg-icons';
import { View,StyleSheet } from 'react-native';


const Tab = createBottomTabNavigator();
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue', // Set the desired background color here
  },
});


function App(): JSX.Element {
  return (

    <NativeBaseProvider>
     <NavigationContainer>
     {/* <ScrollView
        contentInsetAdjustmentBehavior="automatic">
        <Header />
        <View>
          <Section title="Step One">
            Edit <Text>App.tsx</Text> to change this
            screen and then come back to see your edits. My edits are woohooo!
          </Section>
         
        </View>
      </ScrollView>  */}
      <Tab.Navigator 
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let icon;
              switch (route.name) {
                case 'Home':
                  icon = faHome;
                  break;
                case 'Location':
                  icon = faLocationPin;
                  break;
                case 'Scan QR':
                  icon = faQrcode;
                  break;
                case 'Profile':
                  icon = faUser;
                  break;
                default:
                  icon = faHome;
              }
              return <FontAwesomeIcon icon={icon} color={color} size={size} />;
            }, headerShown:false, tabBarActiveBackgroundColor:"black"
          })}
          >
       <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Scan QR" component={ScanQR} />
        <Tab.Screen name="Location" component={Location}/>
        <Tab.Screen name="Profile" component={Profile} /> 
      </Tab.Navigator>
    </NavigationContainer>
      </NativeBaseProvider>
  )
};

export default App;
