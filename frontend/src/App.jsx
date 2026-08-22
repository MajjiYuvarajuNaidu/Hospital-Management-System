import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminDashboard from "./pages/AdminDashboard";

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Doctors from "./pages/Doctors";
import BookAppointment from "./pages/BookAppointment";
import MedicalRecords from "./pages/MedicalRecords";
import Payment from './pages/Payment'

function App() {
  return (
    <BrowserRouter>
      <Navbar title="Hospital Management System" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Doctors />} />
        
        
        <Route
  path="/book-appointment"
  element={
    <ProtectedRoute>
      <BookAppointment />
    </ProtectedRoute>
  }
/>
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
   
   <Route
  path="/medical-records"
  element={
    <ProtectedRoute>
      <MedicalRecords />
    </ProtectedRoute>
  }
/>
    <Route
    path="/admin/dashboard"
    element={<AdminDashboard />}
/> 

   <Route path="/payment" element={<Payment />} />
     
      </Routes>
    </BrowserRouter>
  )
}

export default App