import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './Admin/pages/Dashboard/AdminDashboard';
import ManageCars from './Admin/pages/Dashboard/manageCars';
import Reports from './Admin/pages/Dashboard/Reports';
import Maintenance from './Admin/pages/Maintanace/Maintenance';
import AddMaintenance from './Admin/pages/Maintanace/AddMaintenance';
import Profile from './Renter/pages/Dashboard/Profile';
import EditProfile from './Renter/pages/Dashboard/EditProfile';
import Location from './Common/pages/Location/Location';
import CarList from './Admin/pages/Cars/CarList';
import AddNewCar from './Admin/pages/Cars/AddNewCar';
import RenterDashboard from './Renter/pages/Dashboard/RenterDashaboard';
import RideInfo from './Renter/pages/Rides/RideInfo';
import RideProcess from './Renter/pages/Rides/RideProcess';
import Login from './Authentication/pages/Login'; 
import Register from './Authentication/pages/Register';
import Home from './Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/ManageCars" element={<ManageCars />} />
      <Route path="/CarList" element={<CarList />} />
      <Route path="/AddNewCar" element={<AddNewCar />} />
      <Route path="/Reports" element={<Reports />} />
      <Route path="/Maintenance" element={<Maintenance />} />
      <Route path="/AddMaintenance" element={<AddMaintenance />} />
      <Route path="/Location" element={<Location />} />
      <Route path="/RenterDashboard" element={<RenterDashboard />} />
      <Route path="/ride-info" element={<RideInfo />} />
      <Route path="/ride-process" element={<RideProcess />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/EditProfile" element={<EditProfile />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
        
      {/* Fallback route for debugging */}
      <Route path="*" element={<div style={{background: 'red', color: 'white', padding: 20, fontWeight: 'bold', fontSize: 24}}>DEBUG: Fallback route rendered. Routing is working.</div>} />
    </Routes>
  );
}

export default App;
