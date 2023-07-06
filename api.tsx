import Config from 'react-native-config';
import axios from 'axios';
console.log(Config.REACT_APP_IP_ADDRESS);
export const axiosInstance = axios.create({
  baseURL: Config.REACT_APP_IP_ADDRESS,
});
