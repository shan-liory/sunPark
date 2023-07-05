import React, {useState, useEffect} from 'react';
import {
  Box,
  Text,
  ScrollView,
  VStack,
  Image,
  Divider,
  Center,
  Button,
  HStack,
  Modal,
  Spinner,
  Pressable,
} from 'native-base';
import moment from 'moment';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Calendar, LocaleConfig, WeekCalendar} from 'react-native-calendars';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  faCab,
  faCircleInfo,
  faTruckMedical,
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Reservation = () => {
  const ipAddress1 = 'http://172.20.10.4:3500';
  const ipAddress2 = 'http://192.168.1.104:3500';

  let selectedIpAddress = ipAddress2;
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [reservedLot, setReservedLot] = useState('');
  const [reserveParking, setReserveParking] = useState([
    {
      _id: '',
      name: '',
      isReserved: false,
      isParked: false,
      type: '',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [hasReservation, setHasReservation] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [hasQRSession, setHasQRSession] = useState(false);
  const [profileData, setProfileData] = useState({
    id: '',
    name: '',
    carPlate: '',
    email: '',
    phone: '01-- --- ----',
    parkingLot: '',
    reservedParkingLot: '',
    pendingReservedParkingLot: '',
  });
  const [allReservationDetails, setAllReservationDetails] = useState({
    id: '',
    email: '',
    studentName: '',
    studentCarPlate: '',
    reservedAt: '',
    chosenLot: '',
    chosenLotStatus: '',
  });

  // useEffect(() => {
  const getData = async () => {
    try {
      const today = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
      const keyValuePair = await AsyncStorage.multiGet([
        'id',
        'name',
        'carPlate',
        'email',
        'phone',
        'parkingLot',
        'reservedParkingLot',
        'pendingReservedParkingLot',
      ]);
      if (keyValuePair !== null) {
        const values = keyValuePair.map(([key, value]) => value);
        const profileValues = values.map(value => value || '');
        const [
          id,
          name,
          carPlate,
          email,
          phone,
          parkingLot,
          reservedParkingLot,
          pendingReservedParkingLot,
        ] = profileValues;
        const profileData = {
          id: id || '',
          name: name || '',
          carPlate: carPlate || '',
          email: email || '',
          phone: phone || '',
          parkingLot: parkingLot || '',
          reservedParkingLot: reservedParkingLot || '',
          pendingReservedParkingLot: pendingReservedParkingLot || '',
        };
        setProfileData(profileData);
        setAllReservationDetails({
          id: profileData.id,
          email: profileData.email,
          studentName: profileData.name,
          studentCarPlate: profileData.carPlate,
          reservedAt: today,
          chosenLot: route.params.object.name,
          chosenLotStatus: 'pending',
        });
        console.log('profileData(R)', profileData);
        // value previously stored
      } else {
        console.log('is null');
      }
    } catch (e) {
      // error reading value
    }
  };
  //   getData();
  // }, []);

  const getRParking = () => {
    try {
      axios
        .get(`${selectedIpAddress}/availableReserveParkingLots`)
        .then(response => {
          setReserveParking(response.data.rParkingLots);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    } catch (error) {
      console.log('getRParking', 'error');
    }
  };

  const getTodayForCalendar = () => {
    const date = new Date();
    const year: any = date.getFullYear();
    const month: any = date.getMonth() + 1; // Note: month index starts from 0
    let day: any = date.getDate();

    if (day < 10) {
      day = '0' + day;
    }

    const minDate: string = year + '-' + '0' + month + '-' + day;

    return minDate;
  };

  const toReservationDetails = async (object: Object) => {
    navigation.navigate('ConfirmReserve', {object});
    console.log(object);
  };

  useEffect(() => {
    const getStatus = async () => {
      const user = await AsyncStorage.getItem('id');
      const parkingLot = await AsyncStorage.getItem('parkingLot');
      const pendingPL = await AsyncStorage.getItem('pendingReservedParkingLot');
      const reservedPL = await AsyncStorage.getItem('reservedParkingLot');

      console.log(parkingLot, pendingPL, reservedPL);
      try {
        await axios
          .get(`${selectedIpAddress}/retrieveUserReservationStatus`, {
            params: {
              value: user,
            },
          })
          .then(response => {
            console.log('status');
            if (response.data.message == 'pending') {
              console.log('pending');
              (async () => {
                await AsyncStorage.setItem(
                  'pendingReservedParkingLot',
                  response.data.data.parkingLotName,
                );
              })();
            } else if (response.data.message == 'rejected') {
              navigation.navigate('ReservationStatus', {allReservationDetails});
            }
          })
          .catch(error => {
            console.log('pendingR', error);
          });
      } catch (error) {
        console.log(error);
      }

      if (parkingLot != null) {
        setHasQRSession(true);
      } else if (pendingPL != null || reservedPL != null) {
        navigation.navigate('ReservationStatus', {allReservationDetails});
      }

      console.log(parkingLot, pendingPL, reservedPL);
    };

    const unsubscribe = navigation.addListener('focus', getStatus);

    // Cleanup the listener when the component unmounts or the screen loses focus
    return () => {
      unsubscribe();
    };
  }, []);

  // const timer = setTimeout(getData, 2000);

  // if (allReservationDetails.studentName != '') {
  //   clearTimeout(timer);
  // }

  useEffect(() => {
    const interval = setInterval(getRParking, 5000); // Fetch data every 5 seconds
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box bg="#003572" flex={1} alignContent="center">
      <HStack justifyContent={'space-between'} mt={5} mr={5} ml={5}>
        <Text fontSize="20" fontWeight="bold" color="white">
          Reservation
        </Text>
        <Pressable onPress={() => setOpen(true)}>
          <FontAwesomeIcon
            icon={faCircleInfo}
            size={30}
            color="white"
            style={{marginTop: 4}}
          />
        </Pressable>
      </HStack>
      <ScrollView>
        <VStack
          space="4"
          width="90%"
          alignSelf={'center'}
          mt={4}
          mb={10}
          justifyContent={'space-between'}>
          <Calendar
            disableMonthChange={true}
            hideExtraDays={true}
            minDate={getTodayForCalendar()}
            maxDate={getTodayForCalendar()}
            hideArrows={true}
            onDayPress={day => {
              console.log('selected day', day);
            }}
            style={{
              borderWidth: 1,
              borderColor: 'gray',
            }}
            theme={{
              todayDotColor: '#000000',
              backgroundColor: '#00adf5',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#000000',
              arrowColor: 'orange',
              monthTextColor: 'blue',
              indicatorColor: 'blue',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: 'bold',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: 'bold',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
          />
          {reserveParking.map((reserveParking: any, index: any) => (
            <Pressable
              key={reserveParking._id}
              isDisabled={hasQRSession || reserveParking.isReserved}
              onPress={() => toReservationDetails(reserveParking)}>
              <Box
                p="4"
                borderWidth={1}
                borderRadius={10}
                bg="#F3F3F3"
                borderColor="#F79520">
                <HStack>
                  <Image
                    alt="logo"
                    source={require('../asset/car.png')}
                    opacity={
                      hasQRSession || reserveParking.isReserved ? 0.5 : 1
                    }></Image>
                  <VStack>
                    <Text
                      opacity={
                        hasQRSession || reserveParking.isReserved ? 0.5 : 1
                      }>
                      {' '}
                      {reserveParking.name}{' '}
                    </Text>
                    {reserveParking.isReserved ? (
                      <Text
                        fontSize="30"
                        fontWeight="bold"
                        color={'red.700'}
                        opacity={
                          hasQRSession || reserveParking.isReserved ? 0.5 : 1
                        }>
                        RESERVED
                      </Text>
                    ) : (
                      <Text
                        fontSize="30"
                        fontWeight="bold"
                        color={'green.700'}
                        opacity={hasQRSession ? 0.5 : 1}>
                        OPEN
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Box>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        safeAreaTop={true}
        _backdrop={{
          _dark: {
            bg: 'coolGray.800',
          },
          bg: 'warmGray.50',
        }}>
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Info</Modal.Header>
          <Modal.Body>
            <Text justifyContent={'space-between'}>
              Please note that you can only reserve a parking spot on the same
              day of your intended use. Reservation requests made in advance
              will require review and confirmation by the administrator. This
              process ensures that all parking reservations are properly managed
              and approved. We appreciate your understanding and cooperation in
              adhering to this policy.
            </Text>
            <Text>Thank you for using our parking reservation system.</Text>
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
    </Box>
  );
};

export default Reservation;
