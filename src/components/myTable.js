import React, { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../config/firebase';

function GridExample() {
  const [rowData, setRowData] = useState([]);

  // Column Definitions: Defines & controls grid columns.
  const [columnDefs, setColumnDefs] = useState([
    { field: 'EmployeeID' },
    { field: 'Name' },
    { field: 'Surname' },
    { field: 'ReportsTo' },
    { field: 'Role' },
    { field: 'Salary' },
    { field: 'Birthdate' },
  ]);

  const defaultColDef = useMemo( () => ({
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

          fetchedData.push({
            EmployeeID: data.EmployeeID,
            Name: data.Name,
            Surname: data.Surname,
            ReportsTo: reportsToObj.Name ? `${reportsToObj.Name} ${reportsToObj.Surname}` : "No one",
            Role: roleObj.Name ? roleObj.Name : "Not found",
            Salary: data.Salary,
            Birthdate: data.Birthdate,
          });
        });

        // Set the rowData state with the fetched data
        setRowData(fetchedData);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchInfo();
  }, []);

  // Container: Defines the data grid's theme & dimensions.
  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: 800 }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} defaultColDef={{defaultColDef}} animateRows={true}/>
    </div>
  );
}

export default GridExample;
