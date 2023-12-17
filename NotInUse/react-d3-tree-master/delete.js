import '../App.css';
import { db } from '../../src/config/firebase';
import { deleteDoc, doc } from 'firebase/firestore';



export const deleteRecord = async (id) => {
    try{
        const employeeDoc = doc(db, "users", id);
        await deleteDoc(employeeDoc);
    } catch (err) {
        console.error(err)
    };
};