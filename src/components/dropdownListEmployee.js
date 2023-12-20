import React, { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase'; // Import your Firestore configuration

const EmployeeDropdown = ({ onSelect }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'associates'), () => {
      // Set dataChanged to trigger a re-render
      setDataChanged(true);
    });

  // Cleanup function to unsubscribe from the snapshot listener
  return () => {
    unsubscribe();
  };
  }, [dataChanged]);

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
            surname: userData.Surname,
          });
        });

        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [dataChanged]);

  const handleUserSelect = (event) => {
    const selectedId = event.target.value;
    setSelectedUserId(selectedId);
    onSelect(selectedId);
  };

  return (
    <div>
      <label htmlFor="userDropdown">Select Subordinate:</label>
      <select id="userDropdown" onChange={handleUserSelect} value={selectedUserId}>
        <option value="">Employee</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} {user.surname}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EmployeeDropdown;