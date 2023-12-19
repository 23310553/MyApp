import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase'; 

const ManagerDropdown = ({ onSelect }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'associates');
        const usersSnapshot = await getDocs(usersCollection);

        const userList = [];
        usersSnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          userList.push({
            id: userDoc.id,
            name: userData.Name, 
          });
        });

        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (event) => {
    const selectedId = event.target.value;
    setSelectedUserId(selectedId);
    onSelect(selectedId);
  };

  return (
    <div>
      <label htmlFor="userDropdown">Select Line Manager:</label>
      <select id="userDropdown" onChange={handleUserSelect} value={selectedUserId}>
        <option value="">Manager</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ManagerDropdown;
