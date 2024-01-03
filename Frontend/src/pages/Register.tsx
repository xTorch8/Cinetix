import React, {useState, useContext, ChangeEvent, SyntheticEvent} from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";

import { AppContext } from "../context/app-context";

import RegisterAPI from "../data/api/users/RegisterAPI";

const Register = () : JSX.Element => {
    const navigate = useNavigate();

    // appContext
    //  Use app-context.tsx and retrieve isFormActive   
    const appContext = useContext(AppContext);
    const {isFormActive} = appContext;

    // firstName
    //  The value of firstName field.
    const [firstName, setFirstName] = useState<string>("");

    // lastName
    //  The value of lastName field.
    const [lastName, setLastName] = useState<string>("");  

    // email
    //  The value of email field.
    const [email, setEmail] = useState<string>("");

    // password
    //  The value of password field.
    const [password, setPassword] = useState<string>("");

    // confirmPassword
    //  The value of password field.
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    
    // error
    //  The error that occured in the login proccess.
    const [error, setError] = useState<string>("");


    // firstNameChangeHandler
    //  Change the value of firstName whenever input in the form changed.
    const firstNameChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    }

    // lastNameChangeHandler
    //  Change the value of lastName whenever input in the form changed.
    const lastNameChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
    }

    // emailChangeHandler
    //  Change the value of email whenever input in the form changed.
    const emailChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    // passwordChangeHandler
    //  Change the value of password whenever input in the form changed.
    const passwordChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    // confirmPasswordChangeHandler
    //  Change the value of confirmPassword whenever input in the form changed.
    const confirmPasswordChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    }

    // submitHandler
    //  Submit the form and get the response.
    const submitHandler = async (event : SyntheticEvent) => {
        event.preventDefault();
        try {
            const data = await RegisterAPI(firstName, lastName, email, password, confirmPassword);
            // If registration process sucess, redirect to login.
            if (data.success) {
                navigate("/login");
            }
            else {
                setError(data.error);
            }
        }
        catch (error) {
            console.error(error);
            setError("Server error");
        }
    }
    
    
    return (
        <main>
            <Header/>

            <Form submit = {submitHandler}>
                <h1 className="text-2xl font-bold text-center"> Register </h1>

                <section>
                <Input 
                    label = "First Name"
                    inputType = "text"
                    change = {firstNameChangeHandler}
                    placeholder = "First name..."
                    required = {true}
                />

                <Input 
                    label = "Last Name"
                    inputType = "text"
                    change = {lastNameChangeHandler}
                    placeholder = "Last name..."
                    required = {false}
                />                
                </section>


                <Input 
                    label = "Email"
                    inputType = "email"
                    change = {emailChangeHandler}
                    placeholder = "a@b.com"
                    required = {true}
                />

                <Input 
                    label = "Password"
                    inputType = "password"
                    change = {passwordChangeHandler}
                    placeholder = ""
                    required = {true}
                />

                <Input 
                    label = "Confirm Password"
                    inputType = "password"
                    change = {confirmPasswordChangeHandler}
                    placeholder = ""
                    required = {true}
                />            

                <Button
                    type        = "submit"
                    label       = "Submit"
                    center      = {true}
                    disabled    = {isFormActive}
                />              

                <h1 className="text-red-600 font-bold"> {error} </h1>                        
            </Form>                    
        </main>

    )
}

export default Register;