import { useState } from 'react';
import '../App.css';
import { auth } from '../../src/config/firebase';
import { addDoc} from 'firebase/firestore';
import { employeeCollectionRef } from '../../src/App';
import { List } from './emList';



export function Create () {

// New employee states
const [newEmployeeName, setNewEmployeeName] = useState("");
const [newEmployeeSurname, setNewEmployeeSurname] = useState("");
const [newIsEmployeeHead, setNewIsEmployeeHead] = useState(false);

    const onSubmitRecord= async () => {
        try {
          await addDoc(employeeCollectionRef, {
            Name: newEmployeeName, 
            Surname: newEmployeeSurname, 
            isEmployeeHead: newIsEmployeeHead,
            userID: auth?.currentUser?.uid,
          });
        //   return (
        //     <List />
        //   )
        } catch (err) {
          console.error(err)
        }
      };

    return (
        <div>
            <input 
            placeholder="Name..." 
            onChange={(e) => setNewEmployeeName(e.target.value)}
            />
            <input 
            placeholder="Surname..." 
            onChange={(e) => setNewEmployeeSurname(e.target.value)}
            />
            <input 
            type='checkbox' 
            //code that will match the state given to isEmployeeHead default value
            //checked=(newIsEmployeeHead)
            onChange={(e) => setNewIsEmployeeHead(e.target.value)}
            />
            <label> Is the head Line Manager </label>
            <button onClick={onSubmitRecord}> Create new employee record </button>
        </div>
    )
};