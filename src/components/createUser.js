import React, { useState } from 'react';
import Text from '../components/elements/Text';
import { NavLink, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Formik, Field, Form } from 'formik';

const Signup = () => {
    const navigate = useNavigate();

    const [errors, setErrors] = useState('');
    const [loading, setLoading] = useState(false);

    const initialValues = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    }

    const validateForm = (values) => {
        const errors = {};

        if (!values.firstName) {
            errors.firstName = "First name is required";
        } else if (values.firstName.length <= 3) {
            errors.firstName = 'Must be 3 characters or more';
        }

        if (!values.lastName) {
            errors.lastName = "Last name is required";
        } else if (values.lastName.length <= 3) {
            errors.lastName = 'Must be 3 characters or more';
        }

        if (!values.email) {
            errors.email = "Email is required";
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
            errors.email = "Invalid email address";
        }

        if (!values.password) {
            errors.password = "Password must contain a number";
        } else if (values.password.length <= 8) {
            errors.password = "Password must be more than 7 characters";
        }

        if (values.password !== values.confirmPassword) {
            errors.password = "Password does not match!";
        }

        return errors;
    }

    const onSubmitSignupForm = async (values) => {
        setLoading(true);
        await createUserWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                // Signed in 
                setLoading(false);
                const user = userCredential.user;
                console.log(user);
                navigate("/")
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrors(errorMessage);
                setLoading(false);
                console.log(errorCode, errorMessage);
                // ..
            });

        await updateProfile(auth.currentUser, {
            displayName: `${values.firstName} ${values.lastName}`,
        }).then(() => {
            console.log("updated successfully");
        }).catch((error) => {
            console.log("error updating name");
            console.log(error);
        })
    }
    const onGoogleSubmit = async (e) => {
                e.preventDefault()
        
                const provider = new GoogleAuthProvider();
                // Start a sign in process for an unauthenticated user.
                provider.addScope('profile');
                provider.addScope('email');
                
        
                const result = await signInWithPopup(auth, provider)
                .then((userResult) => {
                        // The signed-in user info.
                const user = userResult.user;
                // This gives you a Google Access Token.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                console.log(user)
                console.log(token);
                navigate("/login")
                    
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                });
            }
   

    return (
        <main >
            <section>
                <div className="sign-up grid md:grid-cols-2 h-screen  ">
                    <div className="md:w-full w-4/5 mx-auto ">
                        <div className='flex md:w-4/5  mx-auto flex-col justify-center h-screen '>
                            <div>
                                <div>
                                    <h1>
                                    <Text className="text-2xl text-white text-center font-bold mb-2">
                                        CRM App
                                    </Text>
                                    </h1>

                                    <h3 className="text-white text-center text-sm md:text-xs tracking-tight text-gray-900">
                                        Are you new? Sign up to CRM App today!
                                    </h3>
                                </div>

                                <div className='mt-4 text-xs' style={{ color: "red" }}>
                                    {errors && errors}
                                </div>

                                <div>
                                    <Formik
                                        initialValues={initialValues}
                                        validate={validateForm}
                                        onSubmit={(values) => onSubmitSignupForm(values)}
                                    >
                                        {
                                            ({
                                                values,
                                                errors,
                                                touched,
                                                handleChange,
                                                handleBlur,
                                                handleSubmit,
                                                isSubmitting
                                            }) => (
                                                <Form className="mt-8 space-y-6" >
                                                    <div className=" space-y-6 rounded-md shadow-sm">
                                                        <div>
                                                            <label htmlFor="email-address" className="sr-only">
                                                                First name
                                                            </label>
                                                            <Field
                                                                type="firstName"
                                                                id="firstName"
                                                                name="firstName"
                                                                value={values.firstName}
                                                                onChange={handleChange}
                                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                placeholder="First name"
                                                            />
                                                            <p className='text-xs' style={{ color: 'red' }}>
                                                                {errors.firstName && touched.firstName && errors.firstName}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <label htmlFor="email-address" className="sr-only">
                                                                Surname
                                                            </label>
                                                            <Field
                                                                type="lastName"
                                                                id="lastName"
                                                                name="lastName"
                                                                value={values.lastName}
                                                                onChange={handleChange}
                                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                placeholder="Last name"
                                                            />
                                                            <p className='text-xs' style={{ color: 'red' }}>
                                                                {errors.lastName && touched.lastName && errors.lastName}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <label htmlFor="email-address" className="sr-only">
                                                                Email address
                                                            </label>
                                                            <Field
                                                                type="email"
                                                                id="email"
                                                                name="email"
                                                                value={values.email}
                                                                onChange={handleChange}
                                                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                placeholder="Email address"
                                                            />

                                                            <p className='text-xs' style={{ color: 'red' }}>
                                                                {errors.email && touched.email && errors.email}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <label htmlFor="password" className="sr-only">
                                                                Password
                                                            </label>
                                                            <Field
                                                                type="password"
                                                                id="password"
                                                                name="password"
                                                                value={values.password}
                                                                onChange={handleChange}
                                                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                placeholder="Password"
                                                            />

                                                            <p className='text-xs' style={{ color: 'red' }}>
                                                                {errors.password && touched.password && errors.password}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <label htmlFor="password" className="sr-only">
                                                                Confirm Password
                                                            </label>
                                                            <Field
                                                                type="password"
                                                                id="confirmPassword"
                                                                name="confirmPassword"
                                                                value={values.confirmPassword}
                                                                onChange={handleChange}
                                                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                placeholder="Confirm Password"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <button
                                                            type="submit"
                                                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        >
                                                            <span>
                                                                {loading ? "Creating Account ..." : " Sign up"}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </Form>
                                            )
                                        }

                                    </Formik>
                                </div>
                            </div>
                            <br />
                            <div>
                                Want to use your Google account?{' '}
                                <button onClick={onGoogleSubmit}> Sign up with Google </button>
                            </div> 
                            <br />

                            <p className="mt-10 text-sm text-white text-center">
                                Already have an account?{' '}
                                <NavLink to="/" className="underline text-tertiary">
                                    Sign in
                                </NavLink>
                            </p>
                        </div>
                    </div>

                    <div className='bg-sidebar md:block hidden h-screen'>
                        <div className='flex items-center justify-center bg-no-repeat bg-center bg-cover h-screen' style={{ backgroundImage: "url('/bg-login.jpg')" }}>
                        </div>
                    </div>
                </div>
            </section>
        </main>

    )
}

export default Signup
