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
  const navigation = useNavigation<any>();
  type ReserveParking = [
    {
      _id: string;
      name: string;
      type: String;
      isReserved: boolean;
      isParked: boolean;
    },
  ];
  const [reservedLot, setReservedLot] = useState('');
  const [reserveParking, setReserveParking] = useState<ReserveParking>([
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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    axios
      //.get("http://192.168.1.111:3500/availableReserveParkingLots")
      .get('http://172.20.10.4:3500/availableReserveParkingLots')
      .then(response => {
        setReserveParking(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const date = new Date();
  const year: any = date.getFullYear();
  const month: any = date.getMonth() + 1; // Note: month index starts from 0
  const day: number = date.getDate();
  const minDate: any = year + '-' + '0' + month + '-' + day;

  const toReservationDetails = async (object: Object) => {
    navigation.replace('ConfirmReserve', {object});
    console.log(object);
  };

  useEffect(() => {
    const getReservationStatus = async () => {
      console.log('status');
      const value = await AsyncStorage.getItem('id');
      try {
        axios
          .get('http://172.20.10.4:3500/retrieveUserReservationStatus', {
            params: {
              value: value,
            },
          })
          .then(response => {
            if (response.data.message == 'approved') {
              console.log('approved');
              (async () => {
                await AsyncStorage.setItem('pendingReservedParkingLot', '');
                await AsyncStorage.setItem(
                  'reservedParkingLot',
                  response.data.data,
                );
              })();
            } else if (response.data.message == 'rejected') {
              console.log('rejected');
              (async () => {
                await AsyncStorage.setItem('pendingReservedParkingLot', '');
              })();
            }
            // console.log(response.data.message);
          })
          .catch(error => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getReservationStatus();
  }, [hasReservation, isApproved]);

  const onCancel = async () => {
    console.log('clicked cancel');
    try {
      const value = await AsyncStorage.getItem('pendingReservedParkingLot');
      axios
        .post('http://172.20.10.4:3500/cancelReservation', {value})
        .then(response => {
          if (response.data.message == 'cancelled') {
            (async () => {
              await AsyncStorage.removeItem('pendingReservedParkingLot');
            })();
            setHasReservation(false);
            setIsButtonDisabled(true);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getPendingReservedParkingLot = async () => {
      try {
        const pending = await AsyncStorage.getItem('pendingReservedParkingLot');
        const approve = await AsyncStorage.getItem('ReservedParkingLot');
        // Output the keys to the console
        console.log('approve', approve);
        if (pending == null && approve == null) {
          setHasReservation(false);
          setIsApproved(false);
          // console.log('hasreservation', hasReservation);
          // console.log('isapprove', isApproved);
        } else if (pending == null && approve != null) {
          setHasReservation(true);
          setIsApproved(true);
          setReservedLot(approve);
        }
      } catch (error) {
        console.error('Error retrieving AsyncStorage value:', error);
      }
    };
    console.log(reservedLot);
    getPendingReservedParkingLot();
  }, [hasReservation, isApproved]);

  // useEffect(() => {
  //   // Run the background data fetching process at a specific interval
  //   const interval = setInterval(getReservationStatus, 2000); // Fetch data every 5 seconds

  //   // Clean up the interval when the component unmounts
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

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
        {hasReservation && isApproved ? (
          !isApproved ? (
            <VStack space="4" width="90%" alignItems={'center'} mt={4} mb={10}>
              <Text
                fontWeight="bold"
                color="white"
                justifyContent={'space-between'}>
                You have a pending reservation! Kindly wait for the
                administrator to review your reservation request.
              </Text>
              <Box flex={1}></Box>
              <Button onPress={onCancel} isDisabled={isButtonDisabled}>
                Cancel Reservation
              </Button>
            </VStack>
          ) : (
            <VStack space="4" width="90%" alignItems={'center'} mt={4} mb={10}>
              <Text fontWeight="bold" color="white">
                Your reserved has been approved!
              </Text>
              <Text fontWeight="bold" color="white">
                Your reserved parking lot is {reservedLot}
              </Text>
              <Box flex={1}></Box>
            </VStack>
          )
        ) : (
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
              minDate={minDate}
              maxDate={minDate}
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
                      source={require('../asset/car.png')}></Image>
                    <VStack>
                      <Text> {reserveParking.name} </Text>
                      {reserveParking.isReserved ? (
                        <Text fontSize="30" fontWeight="bold" color={'red.700'}>
                          RESERVED
                        </Text>
                      ) : (
                        <Text
                          fontSize="30"
                          fontWeight="bold"
                          color={'green.700'}>
                          OPEN
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                </Box>
              </Pressable>
            ))}
          </VStack>
        )}
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
