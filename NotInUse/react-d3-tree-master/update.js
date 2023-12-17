import { useState } from 'react';
import '../App.css';
import { db } from '../../src/config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const UpdatedInfo = async (id) => {
     //Update States
    const [ updateInfo, setUpdatedInfo ] = useState("");
    const [ employeeList ] = useState ([]);

    try{
        const employeeDoc = doc(db, "users", id);
        await 
        updateDoc(employeeDoc, {Name: updateInfo});
    } catch (err) {
        console.error(err)
    };

    return (
        <div>
        {employeeList.map((employee) => (
            <>
            <input placeholder='New Name...' onChange={(e) => setUpdatedInfo(e.target.value)}/>
            <button onClick={() => UpdatedInfo(employee.id)}> Update Information </button>
            </>
        ))}
        </div>
    )
};