import axios from 'axios'

const api = axios.create({
  // baseURL: 'http://localhost:8000',
  baseURL: 'https://flight-status-system.onrender.com',
})

export default api
