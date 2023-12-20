import React, { useState } from 'react';
import { collection, doc, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import ManagerDropdown from './dropdownListManager';



const AddEmployeeDataForm = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [reportsTo, setReportsTo] = useState('');
  const [selectedManager, setSelectedManager] = useState(null);
  const [birthdate, setBirthdate] = useState('');
  const [salary, setSalary] = useState('');

  const handleManagerSelect = (userId) => {
    setSelectedManager(userId);
    console.log('Manager ID is', userId);
  };
  var employeeID = 1;

  const handleAddData = async () => {
    try {
      // Add data to the Firestore collection
      const associatesCollectionRef = collection(db, 'associates');
      const employeeIDQuery = await query(associatesCollectionRef, orderBy('EmployeeID', 'desc'), limit(1));
      const employeeDocs = await getDocs(employeeIDQuery);
      const latestEmployee = employeeDocs.docs.length > 0 ? employeeDocs.docs[0].data() : 1;
      let currentHighestEmployeeID = parseInt(latestEmployee.EmployeeID);
      
      const newAssociateDocRef = await addDoc(associatesCollectionRef, {
        EmployeeID: currentHighestEmployeeID + 1,
        Name: name,
        Surname: surname,
        ReportsTo: selectedManager ? doc(db, 'associates/' + selectedManager) : null, // Set to null if no ReportsTo value provided
        // Role: doc(db, 'associates/'+selectedManager),
        Birthdate: birthdate,
        Salary: salary,

      });

      console.log('Data added successfully with ID:', newAssociateDocRef.id);

      // Clear form fields after successful addition
      setName('');
      setSurname('');
      setReportsTo('');
      setBirthdate('');
      setSalary('')
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  return (
    <div>
      <h2>Add new Employee</h2>
      {/* <label>
        EmployeeID:
        <input type="text" value={name} onChange={(e) => setEmployeeID(e.target.value)} />
      </label>
      <br /> */}
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
      <label>
        Surname:
        <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
      </label>
      <br />
      <label>
        Reports To:
        <ManagerDropdown onSelect={handleManagerSelect} />
      </label>
      {/* <br />
      <label>
        Role:
        <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
      </label> */}
      <br />
      <label>
        Birthdate (dd/mm/yyyy):
        <input type="text" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
      </label>
      <br />
      <label>
        Salary:
        <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} />
      </label>
      <br />
      <button onClick={handleAddData}>Add Employee</button>
    </div>
  );
};

export default AddEmployeeDataForm;