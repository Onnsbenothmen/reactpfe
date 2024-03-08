// apiService.js

import axios from 'axios';

const baseURL = 'http://localhost:5000/api';  // Remplacez cela par l'URL de votre backend Flask

const apiService = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authService = {
  signup: (data) => apiService.post('/signup', data),
  login: (data) => apiService.post('/login', data),
  // Ajoutez d'autres méthodes d'API selon vos besoins
};

export default authService;
