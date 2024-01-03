import React, {useState, ChangeEvent, SyntheticEvent, useContext} from "react";
import { useNavigate } from "react-router-dom";

import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";
import Header from "../components/Header";

import LoginAPI from "../data/api/users/LoginAPI";

import { AppContext } from "../context/app-context";

const Login = () : JSX.Element => {
    const navigate = useNavigate();

    // appContext
    //  Use app-context.tsx and retrieve setUserInformationHandler and isFormActive   
    const appContext = useContext(AppContext);
    const {setUserInformationHandler, isFormActive} = appContext;

    // email
    //  The value of email field.
    const [email, setEmail] = useState<string>("");
    // password
    //  The value of password field.
    const [password, setPassword] = useState<string>("");
    // error
    //  The error that occured in the login proccess.
    const [error, setError] = useState<string>("");

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

    // submitHandler
    //  Submit the form and get the response.
    const submitHandler = async (event : SyntheticEvent) => {
        event.preventDefault();
        try {
            const data = await LoginAPI(email, password);
            // If the login process success, store userInformation in sessionStorage and navigate to /
            if (data.success) {
                sessionStorage.setItem("userInformation", JSON.stringify(data.userInformation));
                setUserInformationHandler(data.userInformation);
                navigate("/");
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
                <h1 className = "text-2xl font-bold text-center"> Login </h1>
            
                <Input 
                    label       = "Email"
                    inputType   = "email"
                    change      = {emailChangeHandler}
                    placeholder = "a@b.com"
                    required    = {true}
                />

                <Input 
                    label       = "Password"
                    inputType   = "password"
                    change      = {passwordChangeHandler}
                    placeholder = ""
                    required    = {true}
                />

                <Button
                    type        = "submit"
                    label       = "Submit"
                    center      = {true}
                    disabled    = {isFormActive}
                />                      
            
                <h1 className = "text-red-600 font-bold"> {error} </h1>  

                <section className = "border-solid border-y-2 border-slate-300 p-2">
                    <button className = "hover:text-red-600" onClick = {() => navigate("/forgot-password")}> 
                        Forgot Your Password? 
                    </button>
                </section>                 
            </Form>            
        </main>
    );
}

export default Login;