import { API_URL_ANDROID, API_URL_IOS, API_URL as PROD_URL, STAGE } from "@env";
import axios from "axios";
import { Platform } from "react-native";

export const API_URL =
  (STAGE === "prod") ? PROD_URL : Platform.OS == "ios" ? API_URL_IOS : API_URL_ANDROID;

// DEBUG EXTREMO
console.log('URL de la API:', API_URL);
console.log('Platform.OS:', Platform.OS);
console.log(' STAGE:', STAGE);

export const tesloApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// INTERCEPTOR DE REQUEST - VER QUÉ SE ENVÍA
tesloApi.interceptors.request.use((config) => {
  console.log('ENVIANDO REQUEST:');
 
  console.log(' Método:', config.method?.toUpperCase());
  console.log('Datos:', config.data);
  console.log('Headers:', config.headers);
  return config;
});

// INTERCEPTOR DE RESPONSE - VER QUÉ RESPONDE
tesloApi.interceptors.response.use(
  (response) => {
    
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    return response;
  },
  (error) => {
    console.log('ERROR:');
    console.log('Mensaje:', error.message);
    console.log('Código:', error.code);
    console.log('Config:', error.config?.baseURL + error.config?.url);
    console.log('Request data:', error.config?.data);
    
    if (error.response) {
      console.log('Response error:', error.response.status, error.response.data);
    }
    
    return Promise.reject(error);
  }
);