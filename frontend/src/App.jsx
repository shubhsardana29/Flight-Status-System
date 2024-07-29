import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import FlightStatus from './pages/FlightStatus'
import axios from "axios";
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/AuthenticatedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

axios.defaults.withCredentials = true;

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/status" element={<ProtectedRoute>
            <FlightStatus />
          </ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
