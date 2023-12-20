import React from 'react';
import { NavLink } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <NavLink to="/mytree" className="mx-2" activeClassName="font-bold">
        Tree Hierarchy
      </NavLink>
      <NavLink to="/mytable" className="mx-2" activeClassName="font-bold">
        Table View
      </NavLink>
    </nav>
  );
};

export default NavigationBar;