import React, { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase'; 

const RoleDropdown = ({ onSelect }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'roles'), () => {
      // Set dataChanged to trigger a re-render
      setDataChanged(true);
    });

  // Cleanup function to unsubscribe from the snapshot listener
  return () => {
    unsubscribe();
  };
  }, [dataChanged]);


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesCollection = collection(db, 'roles');
        const rolesSnapshot = await getDocs(rolesCollection);

        const rolesList = [];
        rolesSnapshot.forEach((roleDoc) => {
          const roleData = roleDoc.data();
          rolesList.push({
            id: roleDoc.id,
            name: roleData.Name, 
          });
        });

        setRoles(rolesList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchRoles();
  }, [dataChanged]); // Trigger fetchUsers when dataChanged state changes

  const handleRoleSelect = (event) => {
    const selectedId = event.target.value;
    setSelectedRoleId(selectedId);
    onSelect(selectedId);
  };

  return (
    <div>
      <label htmlFor="roleDropdown">Select Role:</label>
      <select id="roleDropdown" onChange={handleRoleSelect} value={selectedRoleId}>
        <option value="">Role</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleDropdown;
