import React, {useState} from 'react';
import { collection, doc, updateDoc, DocumentReference } from 'firebase/firestore';
import { db } from '../config/firebase';
import ManagerDropdown from './dropdownListManager';
import EmployeeDropdown from './dropdownListEmployee';

const AssignLineManager = () => {
    const [selectedManager, setSelectedManager] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
  
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
          // Update reference field data for the Employee
          const employeeDocRef = doc(db, 'associates', selectedEmployee);
          await updateDoc(employeeDocRef, { ReportsTo: doc(db,'associates/'+selectedManager) });

          console.log('Data updated successfully!');
        } catch (error) {
          console.error('Error updating data:', error);
        }
      } else {
        console.warn('Please select both users before updating data.');
      }
    };
  
    return (
      <div>
        <ManagerDropdown onSelect={handleManagerSelect} />
        <EmployeeDropdown onSelect={handleEmployeeSelect} />
        <button onClick={handleUpdateData}>Assign</button>
      </div>
    );
  };
  
  export default AssignLineManager;