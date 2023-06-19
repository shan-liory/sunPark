import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './screen/Home';
import Login from './screen/Login';
import Location from './screen/Location';
import Profile from './screen/Profile';
import ScanQR from './screen/ScanQR';
import EditProfile from './screen/EditProfile';
import ParkingSession from './screen/ParkingSession';
import Maps from './screen/Map';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NativeBaseProvider, Box, Text } from 'native-base';
import { faHome,faQrcode,faLocationPin,faUser,faBell,faSearch,faTicket } from '@fortawesome/free-solid-svg-icons';
import { createStackNavigator } from '@react-navigation/stack';
import Reservation from './screen/Reservation';
import SignUp from './screen/SignUp';

const Tab = createBottomTabNavigator();

const LocationStack = createStackNavigator();

function LocationStackNavigator() {
  return (
    <LocationStack.Navigator screenOptions={{ headerShown: false }}>
      <LocationStack.Screen name="Location1" component={Location} />
      <LocationStack.Screen name="Maps" component={Maps} />
    </LocationStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();


function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile1" component={Profile} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
    </ProfileStack.Navigator>
  );
}
const Stack = createStackNavigator();

const QRStack = createStackNavigator();
function QRStackNavigator() {
  return (
    <QRStack.Navigator screenOptions={{ headerShown: false }}>
      <QRStack.Screen name="QR1" component={ScanQR} />
      <QRStack.Screen name="ParkingSession" component={ParkingSession} />
    </QRStack.Navigator>
  );
}

const MainNavigator = () => (
  <Tab.Navigator 
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let icon;
              switch (route.name) {
                case 'Home':
                  icon = faHome;
                  break;
                case 'Reserve':
                  icon = faTicket;
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
        <Tab.Screen name="Reserve" component={Reservation} />
        <Tab.Screen name="Scan QR" component={QRStackNavigator} />
        <Tab.Screen name="Location" component={LocationStackNavigator}/>
        <Tab.Screen name="Profile" component={ProfileStackNavigator}/> 
      </Tab.Navigator>
);

const App: React.FC =() => {
  return (
    <NativeBaseProvider>
     <NavigationContainer>
     <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
      </NativeBaseProvider>
  )
};

export default App;
