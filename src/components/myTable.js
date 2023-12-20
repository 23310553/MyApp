import React, { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from '../config/firebase';

function GridExample() {

  var wordFilterParams = {
    filterOptions: ['contains', 'notContains'],
    textFormatter: (r) => {
      if (r == null) return null;
      return r
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/æ/g, 'ae')
        .replace(/ç/g, 'c')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/ñ/g, 'n')
        .replace(/[òóôõö]/g, 'o')
        .replace(/œ/g, 'oe')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ýÿ]/g, 'y');
    },
    debounceMs: 200,
    maxNumConditions: 1,
  };


  const [rowData, setRowData] = useState([]);


  // Column Definitions: Defines & controls grid columns.
  const [columnDefs, setColumnDefs] = useState([
    { field: 'EmployeeID' },
    { field: 'Name',
      filter: 'agTextColumnFilter',
      filterParams: 
      {wordFilterParams,
        buttons: ['apply', 'reset'],
        closeOnApply: true}},
    { field: 'Surname',
      filter: 'agTextColumnFilter',
      filterParams: 
      {wordFilterParams,
        buttons: ['apply', 'reset'],
        closeOnApply: true}},
    { field: 'ReportsTo', 
      filter: 'agTextColumnFilter',
      filterParams: 
      {wordFilterParams,
        buttons: ['apply', 'reset'],
        closeOnApply: true}},
    { field: 'Role',
      filter: 'agTextColumnFilter',
      filterParams: 
      {wordFilterParams,
        buttons: ['apply', 'reset'],
        closeOnApply: true}
    },
    { field: 'Salary', 
      filter: 'agNumberColumnFilter',
      filterParams: 
      {buttons: ['apply', 'reset'],
        closeOnApply: true} },
    { field: 'Birthdate', 
      filter:'agDateColumnFilter',
      filterParams: 
      {buttons: ['apply', 'reset'],
        closeOnApply: true}},
  ]);


  const defaultColDef = useMemo( () => ({
    editable: true,
    sortable: true,
    filter: true,
  }
  ), [])

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const userCollectionRef = collection(db, 'associates');
        const roleCollectionRef = collection(db, 'roles');
        
        const [
          users,
          roles
        ] = await Promise.all([
          getDocs(userCollectionRef),
          getDocs(roleCollectionRef)
        ]);

        const rolesMap = roles.docs.reduce((acc, role) => { return { ...acc, [role.id]: role.data() } }, {});
        const usersMap = users.docs.reduce((acc, user) => { return { ...acc, [user.id]: user.data() } }, {});

        let fetchedData = [];
        users.forEach((doc) => {
          const data = doc.data();
          const roleObj = data.Role ? rolesMap[data.Role.id]: {};
          const reportsToObj = data.ReportsTo ? usersMap[data.ReportsTo.id]: {};
          
          // Spliting birthdate data that is in 'dd/mm/yyyy' format to be able to use in table filter
          const [day, month, year] = data.Birthdate.split('/');

          // Note: JavaScript months are 0-indexed, so we subtract 1 from the month
          const birthdateDate = new Date(`${year}-${month - 1}-${day}`);

          // Check if the date is valid before using it
          if (!isNaN(birthdateDate.getTime())) {
            // The date is valid
              fetchedData.push({
                EmployeeID: data.EmployeeID,
                Name: data.Name,
                Surname: data.Surname,
                ReportsTo: reportsToObj.Name ? `${reportsToObj.Name} ${reportsToObj.Surname}` : "No one",
                Role: roleObj.Name ? roleObj.Name : "Not found",
                Salary: data.Salary,
                Birthdate: birthdateDate,
              });
            } else {
              console.error('Invalid date format:', data.Birthdate);
            }
            
        // Set the rowData state with the fetched data
        setRowData(fetchedData);})
      } catch (error) {
        console.log("error", error);
      }}
    
    const userCollectionRef = collection(db, 'associates');
    const unsubscribe = onSnapshot(userCollectionRef, () => {
      // Trigger a re-fetch when there is a change in the 'associates' collection
      fetchInfo();
    });

    
    fetchInfo();

    return () => {
      // Cleanup function to unsubscribe from the snapshot listener
      unsubscribe();
    };

  }, []);

  // Container: Defines the data grid's theme & dimensions.
  return (
    <div className="myTable ag-theme-alpine" style={{ height: 800, width: 1400 }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} defaultColDef={{defaultColDef}} animateRows={true}/>
    </div>
  );
}

export default GridExample;
