  // Agrega esta función para testear
export const testConnection = async () => {
  try {
    console.log('🧪 TESTEANDO CONEXIÓN...');
    const response = await fetch('http://192.168.1.38:8080/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const text = await response.text();
    console.log('Test conexión exitoso:', response.status, text);
    return true;
  } catch (error) {
    console.log('Test conexión falló:', error);
    return false;
  }
};