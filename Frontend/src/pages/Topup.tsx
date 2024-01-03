import React, {useState, useEffect, useContext, ChangeEvent, SyntheticEvent} from "react";
import { useNavigate } from "react-router-dom";

import Profile from "./Profile";
import Header from "../components/Header";

import { AppContext } from "../context/app-context";
import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";
import TopupAPI from "../data/api/users/TopupAPI";

const Topup = () : JSX.Element => {
    const navigate = useNavigate();
    // appContext
    //  Use app-context.tsx and retrieve userInformation, isFormActive,, and processDoneHandler   
    const appContext = useContext(AppContext);
    const {userInformation, formActiveHandler, processDoneHandler} = appContext;

    useEffect(() => {
        formActiveHandler(true);
    }, []);

    // amount
    //  the value of amount field
    const [amount, setAmount] = useState<string>("");

    const [error, setError] = useState<string>("");

    // amountChangeHandler
    //  Change the value of amount whenever input in the form changed.
    const amountChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    }

    const submitHandler = async (event : SyntheticEvent) => {
        try {
            event.preventDefault();

            if (Number(amount) < 0) {
                setError("Amount must be greater than 0");
            }
            else {
                if (typeof userInformation !== "string") {
                    const data = await TopupAPI(userInformation.email, Number(amount)); 
                    
                    if (data.success) {
                        formActiveHandler(false);
                        processDoneHandler(true);
                        navigate("/profile");
                    }
                }
                
            }

        }   
        catch (error) {
            console.error(error);
            setError("Server error.");
        }
    }

    return (
        <main>
            <section className = "hidden lg:block lg:opacity-20">
                <Profile />
            </section>

            <section className = "block lg:hidden">
                <Header />
            </section>

            <section className = "lg:fixed w-full z-1 lg:top-[25%]">
                <Form submit = {submitHandler}>
                    <section className = "flex items-center">
                        <section className = "w-[95%]">
                            <h1 className = "text-2xl font-bold text-center"> Topup </h1>    
                        </section>
                        <section className = "w-[5%]">
                            <h1 
                                className   = "cursor-pointer hover:text-red-600"
                                onClick     = {() => {formActiveHandler(false); navigate("/profile")}}
                            > 
                                X 
                            </h1>      
                        </section>  
                    </section>
                    <Input
                        label       = "Amount"
                        inputType   = "number"
                        placeholder = ""
                        change      = {amountChangeHandler}
                        required    = {true}
                    />

                    <Button
                        label       = "Submit"
                        type        = "submit"
                        center      = {true}
                        click       = {() => {}}
                        disabled    = {false}
                    />

                    <h1 className = "text-xl font-bold text-red-600"> {error}</h1>
                </Form>                
            </section>

        </main>
    )
}

export default Topup;