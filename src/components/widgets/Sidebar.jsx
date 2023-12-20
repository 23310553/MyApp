import AssignLineManager from '../assignLineManager';
import AddEmployeeDataForm from '../addNewEmployee';
import DeleteEmployee from '../deleteEmployee';
import { FaBars } from 'react-icons/fa';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { Box, Divider, List, SwipeableDrawer } from '@mui/material';
import GravatarComponent from '../elements/Profile Image/gravitarImage';

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    left: false,
  });

  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  const toggleDrawer = (anchor, open) => () => {
    setState({ ...state, [anchor]: open });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
        console.log('Signed out successfully');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <aside className="sidebar text-white">
      <ul>
        <div className="flex items-center space-x-2">
            <GravatarComponent />
        </div>

        <div className="text-white font-bold text-xl">
          Welcome, <span> {user.displayName} </span>
        </div>
        <div>
            <button 
                onClick={handleLogout}
                className="cursor-pointer text-white">
                Logout
            </button>
        </div>
        <br />
          <hr />

        <div className="prop-container">
          <h4 className="text-white font-bold mb-4">Assign a Line Manager</h4>
          <AssignLineManager />
          <br />
        </div>
        <hr />
        <div className="prop-container">
          <h4 className="text-white font-bold mb-4">Add new Employee</h4>
          <AddEmployeeDataForm />
          <br />
        </div>
        <hr />
        <div className="prop-container">
          <h4 className="text-white font-bold mb-4">Delete Employee</h4>
          <DeleteEmployee />
          <br />
        </div>
      </ul>
    </aside>
  );
};

export default Sidebar;
