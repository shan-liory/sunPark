import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screen/Home';
import Location from './screen/Location';
import Profile from './screen/Profile';
import ScanQR from './screen/ScanQR';
import EditProfile from './screen/EditProfile';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeBaseProvider, Box, Text } from 'native-base';
import { faHome,faQrcode,faLocationPin,faUser,faBell,faSearch } from '@fortawesome/free-solid-svg-icons';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();

const ProfileStack = createStackNavigator();


function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile1" component={Profile} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
    </ProfileStack.Navigator>
  );
}

const App: React.FC =() => {
  return (
    <NativeBaseProvider>
     <NavigationContainer>
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
        <Tab.Screen name="Profile" component={ProfileStackNavigator}/> 
      </Tab.Navigator>
    </NavigationContainer>
      </NativeBaseProvider>
  )
};

export default App;
