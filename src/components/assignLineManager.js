import React, {useEffect, useState} from 'react';
import { collection, doc, updateDoc, DocumentReference, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import ManagerDropdown from './dropdownListManager';
import EmployeeDropdown from './dropdownListEmployee';

const AssignLineManager = () => {
    const [selectedManager, setSelectedManager] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleManagerSelect = (userId) => {
      setSelectedManager(userId);
      console.log('Manager ID is', userId);
    };
  
    const handleEmployeeSelect = (userId) => {
      setSelectedEmployee(userId);
      console.log('Employee ID is', userId);
    };
  
    const handleUpdateData = async () => {
      if (selectedManager && selectedEmployee) {
        try {
          // Check if the selected manager is the same as the selected employee
        if (selectedManager === selectedEmployee) {
          throw new Error('Manager and Employee cannot be the same.');
        }

          // Update reference field data for the Employee
          const employeeDocRef = doc(db, 'associates', selectedEmployee);
          await updateDoc(employeeDocRef, { ReportsTo: doc(db,'associates/'+selectedManager) });

          setErrorMessage('Data updated successfully!');
        } catch (error) {
          console.error('Error updating data:', error.message);
          setErrorMessage(error.message);
        }
      } else {
        console.warn('Please select the line manager and subordinate.');
      }
    };
    
    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, 'associates'), () => {
        // Trigger a re-fetch when there is a change in the 'associates' collection
        handleUpdateData();
      });
  
      // Cleanup function to unsubscribe from the snapshot listener
      return () => {
        unsubscribe();
      };
    }, []);  // Empty dependency array means this effect runs once on mount
  
    return (
      <div>
        <ManagerDropdown onSelect={handleManagerSelect} />
        <EmployeeDropdown onSelect={handleEmployeeSelect} />
        <button onClick={handleUpdateData}>Assign</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    );
  };
  
  export default AssignLineManager;