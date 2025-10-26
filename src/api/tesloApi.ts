import { API_URL_ANDROID, API_URL_IOS, API_URL as PROD_URL, STAGE,idPueblo } from "@env";
import axios from "axios";
import { Platform } from "react-native";

export const API_URL =
  (STAGE === "prod") ? PROD_URL : Platform.OS == "ios" ? API_URL_IOS : API_URL_ANDROID;

// DEBUG EXTREMO
console.log('URL de la API:', API_URL);


export const tesloApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// INTERCEPTOR DE REQUEST - VER QUÉ SE ENVÍA
tesloApi.interceptors.request.use((config) => {
  console.log('ENVIANDO REQUEST:');
 
  
  return config;
});

// INTERCEPTOR DE RESPONSE - VER QUÉ RESPONDE
tesloApi.interceptors.response.use(
  (response) => {
    
    
    return response;
  },
  (error) => {
    console.log('ERROR:');
    
    
    if (error.response) {
      console.log('Response error:', error.response.status, error.response.data);
    }
    
    return Promise.reject(error);
  }
);