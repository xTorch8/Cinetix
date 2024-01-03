import React, {useState, useEffect, useContext, ChangeEvent, SyntheticEvent} from "react";
import { useParams, useNavigate } from 'react-router-dom';

import Movies from "./Movies";

import Header from "../../../components/Header";
import Form from "../../../components/Form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

import { AppContext } from "../../../context/app-context";

import DeleteMovieAPI from "../../../data/api/movies/DeleteMovieAPI";

const DeleteMovie = () : JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();

    // appContext
    //  Use app-context.tsx and retrieve userInformation, formActiveHandler, processDoneHandler, and moviesList    
    const appContext = useContext(AppContext);
    const {userInformation, formActiveHandler, processDoneHandler} = appContext; 

    const [error, setError] = useState<string>("");



    // submitHandler
    //  Submit the form and get the response.
    const submitHandler = async (event : SyntheticEvent) => {
        event.preventDefault();
        try {
            if (typeof userInformation !== "string") {
                const userEmail = userInformation.email;

                const data      = await DeleteMovieAPI(userEmail, Number(id));  

                if (data.success) {
                    navigate("/admin/movies");
                }
                else {
                    setError(data.error);
                }

                processDoneHandler(true);
            }
            else {
                setError("Please login.");
                navigate("/login");
            }
        }
        catch (error) {
            console.error(error);        
            setError("Server error");
        }
    }


    return (
        <main>
            <section className = "relative lg:hidden opacity-20">
                <Header/>
            </section>

            <section className = "relative hidden lg:block  opacity-20">
                <Movies/>
            </section>


            <section className = "lg:fixed w-full z-1 lg:top-[25%]">
                <Form submit = {submitHandler}>
                    <section className = "flex items-center">
                        <section className = "w-[95%]">
                            <h1 className = "text-2xl font-bold text-center"> Delete Movie </h1>    
                        </section>
                        <section className = "w-[5%]">
                            <h1 
                                className   = "cursor-pointer hover:text-red-600"
                                onClick     = {() => {formActiveHandler(false); navigate("/admin/movies")}}
                            > 
                                X 
                            </h1>      
                        </section>  
                    </section>
                    
                    <section>
                        <h1 className = "text-lg font-bold text-red-600 text-center"> Are you sure want to delete? This action is irreversible. </h1>
                    </section>
                       
                    <Button
                        type        = "submit"
                        label       = "Submit"
                        center      = {true}
                        disabled    = {false}
                    />                      
                
                    <h1 className = "text-red-600 font-bold"> {error} </h1>              
                </Form>                 
            </section>
           
        </main>
    );
}

export default DeleteMovie;