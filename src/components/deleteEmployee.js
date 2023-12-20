import React, { useState, useEffect } from 'react';
import { getDocs, collection, deleteDoc, doc, query, where, getDoc, CollectionReference, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

async function getCountOfEmployeesReportingToManager(managerRef) {
  const employeesWithSelectedManager = await getDocs(query(collection(db, 'associates'), where('ReportsTo', '==', doc(db,'associates/' + managerRef))));
  return employeesWithSelectedManager.size;
}

function DeleteEmployee() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesCollection = collection(db, 'associates');
        const employeesSnapshot = await getDocs(employeesCollection);
        const employeesData = employeesSnapshot.docs.map((doc) => ({
          id: doc.id,
          Name: doc.Name,
          Surname: doc.Surname,
          ...doc.data(),
        }));
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const unsubscribe = onSnapshot(collection(db, 'associates'), () => {
      // Trigger a re-fetch when there is a change in the 'associates' collection
      fetchEmployees();
    });

    // Initial fetch
    fetchEmployees();

    return () => {
      // Cleanup function to unsubscribe from the snapshot listener
      unsubscribe();
    };
  }, []);

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployee(employeeId);
    setErrorMessage('');
  };

  const handleDeleteEmployee = async () => {
    if (selectedEmployee) {
      try {
        // Check if the employee is a manager for any other employee
        const selectedEmployeeRef = doc(collection(db, 'associates'), selectedEmployee);
        const countOfEmployees = await getCountOfEmployeesReportingToManager(selectedEmployee);
        console.log(countOfEmployees)

        if (countOfEmployees > 0) {
            setErrorMessage('Cannot delete. Please reassign subordinate employees to another manager.');
            return;
        } else {

        // If no issues, proceed with deletion
        await deleteDoc(selectedEmployeeRef);
        setErrorMessage('Employee deleted successfully!');}
      } catch (error) {
        setErrorMessage('Error deleting employee:', error );
      }
    } else {
        setErrorMessage('Please select an employee to delete.');
    }
  };

  return (
    <div>
      <select onChange={(e) => handleEmployeeSelect(e.target.value)}>
        <option value="">Select an employee to delete</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.Name} {employee.Surname}
          </option>
        ))}
      </select>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={handleDeleteEmployee}>Delete </button>
    </div>
  );
}

export default DeleteEmployee;
