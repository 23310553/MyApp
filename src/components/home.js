import React, { useEffect } from 'react';
import Card from './elements/Card';
import Text from '../components/elements/Text';
import Button from './elements/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../components/store/userSlice';
import { useNavigate } from 'react-router-dom';
import GridExample from './myTable';

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
    console.log("user here: ", user.uid);

    return (
        <section className="text-white pt-10 pb-24 px-3  md:pt-10 md:pb-20">

            <section className="grid grid-cols-1 space-y-6 md:space-y-0 md:gap-4">

                <Card className="py-4 col-span-2">

                    <section className="flex justify-center items-center text-center">
                        <div>
                            <Text className="font-bold text-2xl">
                                Tree Hierarchy
                            </Text>

                            <Text className="pt-2 pb-6 text-sm">
                                View tree
                            </Text>

                            <Button
                                onClick={() => navigate("/mytree")}
                            >
                                Tree model
                            </Button>
                        </div>
                    </section>
                    <section className="flex justify-center items-center text-center">
                        <div>
                            <Text className="font-bold text-2xl">
                                Table View
                            </Text>

                            <Button
                                onClick={() => navigate("/mytable")}
                            >
                                Table Model
                            </Button>
                        </div>
                    </section>

                </Card>
            </section>

        </section>
    )
}

export default Home

 