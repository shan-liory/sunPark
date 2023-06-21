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
  Pressable,
} from 'native-base';
import {Calendar, LocaleConfig, WeekCalendar} from 'react-native-calendars';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCab, faCircleInfo, faTruckMedical} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Reservation = () => {

  type ReservedParking = [
    {
      _id: string;
      name: string;
      type: string;
      isReserved: boolean;
      isParked:boolean;
    },
  ];

  const [reservedParking, setReservedParking] = useState<ReservedParking>(
    [{
      _id:"",
      name:"",
      type:"reserved",
      isReserved: false,
      isParked:false,
    }]
  )

  const [open,setOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://192.168.1.111:3500/reservedparking")
      // .get('http://172.20.10.4:3500/reservedparking')
      .then(response => {
        setReservedParking(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  const date = new Date()
  const year:any = date.getFullYear();
  const month:any = date.getMonth() + 1; // Note: month index starts from 0
  const day:number = date.getDate()
  const nextDay = date.getDate() + 1
  const minDate:any = year + "-" +"0"+ month +"-"+ day

  return (
    <Box bg="#003572" flex={1} alignContent="center">
      <HStack justifyContent={'space-between'} mt={5} mr={5} ml={5}>
        <Text fontSize="20" fontWeight="bold" color="white">
          Reservation
        </Text>
        <Pressable onPress={()=> setOpen(true)}>
        <FontAwesomeIcon
          icon={faCircleInfo}
          size={30}
          color="white"
          style={{marginTop: 4}}
        />
        </Pressable>
      </HStack>
        <ScrollView>
        <VStack space="4"  width="90%" alignSelf={"center"} mt={4} mb={10} justifyContent={"space-between"}>
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
              todayDotColor:'#000000',
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

            // Customize other calendar props as needed
          />
           {reservedParking.map((reservedParking: any, index: any) => (
          <Pressable key={reservedParking._id}>
            <Box
              p="4"
              borderWidth={1}
              borderRadius={10}
              bg="#F3F3F3"
              borderColor="#F79520">
              <HStack>
                <Image alt="logo" source={require('../asset/car.png')}></Image>
                <VStack>
                  <Text> {reservedParking.name} </Text>
                  {reservedParking.isReserved ?
                  <Text fontSize="30" fontWeight="bold" color={'red.700'}>RESERVED</Text>
                  :
                  <Text fontSize="30" fontWeight="bold" color={'green.700'}>OPEN</Text>}
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
          >
            <Modal.Content maxWidth="350">
              <Modal.CloseButton />
              <Modal.Header>Info</Modal.Header>
              <Modal.Body>
              <Text justifyContent={"space-between"}>Please note that you can only reserve a parking spot on the same day of your intended use. Reservation requests made in advance will require review and confirmation by the administrator. This process ensures that all parking reservations are properly managed and approved. We appreciate your understanding and cooperation in adhering to this policy. Thank you for using our parking reservation system.</Text>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    colorScheme="blueGray"
                    onPress={() => {
                      setOpen(false);
                    }}
                  >
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
