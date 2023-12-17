import { useEffect, useState } from 'react';
import '../App.css';
import { getDocs } from 'firebase/firestore';
import { deleteRecord } from './delete';
import { employeeCollectionRef } from '../../src/App';
import { UpdatedInfo } from './update';



export function List () {
    const [ employeeList ] = useState ([]);

    useEffect(() => {
        EmployeeList();
      }, []);

    
    return (
        <div>
            {employeeList.map((employee) => (
            <div>
                <h1 style={{color: employee.isHead ? "blue" : "red"}}> {employee.Name} </h1>
                <h2> {employee.Surname} </h2>

                <button onClick={() => deleteRecord(employee.id)}> Delete Record </button>

                {UpdatedInfo(employee.id)}
            </div>
            ))}
        </div>
    );
};


export const EmployeeList = async () => {
    try {
        const data = 
        await
        getDocs (employeeCollectionRef);
        const dataFiltered = data.docs.map((doc) => ({
            ...doc.data(), 
            id: doc.id 
    }));
        EmployeeList(dataFiltered);
    } catch(err) {
        console.error(err)
    }};
