import React from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './Admin.css';
import { Outlet } from 'react-router-dom';

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;