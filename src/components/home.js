import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../components/store/userSlice';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const user = useSelector((state) => state.user.value);
    
    const dispatch = useDispatch();

    const navigate = useNavigate();


    useEffect(() => {      

        const intervalID = setInterval(() => {
            // console.log("yes")
        }, 1000)

        return () => clearInterval(intervalID);
    }, [])

    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch])

    useEffect(() => {
        // Automatically navigate to /mytree when the Home component mounts
        navigate('/mytree');
      }, [navigate]);

    
    console.log("user here: ", user.uid);

    return (
        <>
        </>
    );
};
export default Home

 