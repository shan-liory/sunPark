import React, {useState, useEffect} from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './screen/Home';
import Login from './screen/Login';
import Location from './screen/Location';
import Profile from './screen/Profile';
import ScanQR from './screen/ScanQR';
import EditProfile from './screen/EditProfile';
import ParkingSession from './screen/ParkingSession';
import ConfirmReservation from './screen/ConfirmReservation';
import Maps from './screen/Map';
import SplashScreen from './screen/SplashScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  NativeBaseProvider,
  Box,
  Text,
  extendTheme,
  FormControl,
} from 'native-base';
import {
  faHome,
  faQrcode,
  faLocationPin,
  faUser,
  faBell,
  faSearch,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import {createStackNavigator} from '@react-navigation/stack';
import Reservation from './screen/Reservation';
import SignUp from './screen/SignUp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ReservationStack = createStackNavigator();
function ReservationStackNavigator() {
  return (
    <ReservationStack.Navigator screenOptions={{headerShown: false}}>
      <ReservationStack.Screen name="ReservedOptions" component={Reservation} />
      <ReservationStack.Screen
        name="ConfirmReserve"
        component={ConfirmReservation}
      />
    </ReservationStack.Navigator>
  );
}

const LocationStack = createStackNavigator();

function LocationStackNavigator() {
  return (
    <LocationStack.Navigator screenOptions={{headerShown: false}}>
      <LocationStack.Screen name="Location1" component={Location} />
      <LocationStack.Screen name="Maps" component={Maps} />
    </LocationStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="Profile1" component={Profile} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} />
    </ProfileStack.Navigator>
  );
}

const QRStack = createStackNavigator();
function QRStackNavigator() {
  return (
    <QRStack.Navigator screenOptions={{headerShown: false}}>
      <QRStack.Screen name="QR1" component={ScanQR} />
      <QRStack.Screen name="ParkingSession" component={ParkingSession} />
    </QRStack.Navigator>
  );
}
const AuthStack = createStackNavigator();
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
    </AuthStack.Navigator>
  );
}
function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
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
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveBackgroundColor: 'black',
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Reserve" component={ReservationStackNavigator} />
      <Tab.Screen name="Scan QR" component={QRStackNavigator} />
      <Tab.Screen name="Location" component={LocationStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

const theme = extendTheme({
  components: {
    FormControlLabel: {
      baseStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        _text: {
          fontSize: 'sm',
          color: 'white',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Replace this with your actual loading logic
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
    console.log('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const checkLoginStatus = async () => {
    try {
      const auth = await AsyncStorage.getItem('email');
      console.log('asyncStorageItem', auth);
      if (auth != null) {
        setIsLoggedIn(true);
        //console.log('Status', isLoggedIn);
      } else {
        setIsLoggedIn(false);
      }
    } catch (e) {
      setIsLoggedIn(false);
    }
  };
  return (
    <NativeBaseProvider theme={theme}>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {isLoggedIn ? (
              <React.Fragment>
                <Stack.Screen name="Main" component={MainNavigator} />
                <Stack.Screen name="Main_Auth" component={AuthStackNavigator} />
              </React.Fragment>
            ) : (
              // <Stack.Screen name="auth" component={AuthStackNavigator} />
              <Stack.Screen name="auth" component={AuthStackNavigator} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </NativeBaseProvider>
  );
};

export default App;
