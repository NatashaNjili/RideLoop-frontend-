import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './Admin/pages/Dashboard/AdminDashboard';
import ManageCars from './Admin/pages/Dashboard/manageCars';
import Reports from './Admin/pages/Dashboard/Reports';
import Maintenance from './Admin/pages/Maintanace/Maintenance';
import AddMaintenance from './Admin/pages/Maintanace/AddMaintenance';
import Location from './Common/pages/Location/Location';
import CarList from './Admin/pages/Cars/CarList';
import AddNewCar from './Admin/pages/Cars/AddNewCar';


function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/ManageCars" element={<ManageCars />} />
      <Route path="/CarList" element={<CarList />} />
      <Route path="/AddNewCar" element={<AddNewCar />} />
      <Route path="/Reports" element={<Reports />} />
      <Route path="/Maintenance" element={<Maintenance />} />
      <Route path="/AddMaintenance" element={<AddMaintenance />} />
      <Route path="/Location" element={<Location />} />
      {/* Fallback route for debugging */}
      <Route path="*" element={<div style={{background: 'red', color: 'white', padding: 20, fontWeight: 'bold', fontSize: 24}}>DEBUG: Fallback route rendered. Routing is working.</div>} />
    </Routes>
  );
}

export default App;
