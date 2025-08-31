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
import EditMaintenance from './Admin/pages/Maintanace/EditMaintenance';
import Login from './Authentication/pages/Login'; 
import Register from './Authentication/pages/Register';
import Home from './Home';
import CustomerApproval from "./Admin/pages/Dashboard/CustomerApproval"
import FinancialReport from "./Admin/pages/Reports/FinancialReport"
import FinancialReportsAdmin from "./Admin/pages/Reports/FinancialReportsAdmin"
import CreateReport from "./Admin/pages/Reports/CreateReport"
import UpdateReport from "./Admin/pages/Reports/UpdateReport"
import DeleteReport from "./Admin/pages/Reports/DeleteReport"
import Approval from "./Admin/pages/CustomerApprovals/Aprovals"

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
      <Route path="/CustomerApproval" element={<CustomerApproval />} />
      <Route path="/FinancialReport" element={<FinancialReport />} />
      <Route path="/Reports" element={<Reports />} />
      <Route path="/FinancialReportsAdmin" element={<FinancialReportsAdmin />} />
      <Route path="/CreateReport" element={<CreateReport />} />
      <Route path="/UpdateReport" element={<UpdateReport />} />
      <Route path="/DeleteReport" element={<DeleteReport />} />
      <Route path="/Approval" element={<Approval />} />
        
      {/* Fallback route for debugging */}
      <Route path="*" element={<div style={{background: 'red', color: 'white', padding: 20, fontWeight: 'bold', fontSize: 24}}>DEBUG: Fallback route rendered. Routing is working.</div>} />
    </Routes>
  );
}

export default App;
