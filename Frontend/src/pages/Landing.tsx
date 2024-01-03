import React, { useState, useEffect, useContext, ChangeEvent, SyntheticEvent } from "react"
import { useNavigate } from "react-router-dom";

import "./Landing.css";

import Header from "../components/Header";
import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";

import { AppContext } from "../context/app-context";

import ambianceImage from "../assets/ambiance-image.jpg";
import comfortableImage from "../assets/comfortable-image.jpg";
import projectionImage from "../assets/projection-image.jpeg";


const Landing = () : JSX.Element => {
    const navigate = useNavigate();

    // appContext
    //  Use app-context.tsx and retrieve userInformation
    const appContext = useContext(AppContext);
    const {userInformation} = appContext;

    // If the user has already login, redirect to /home
    useEffect(() => {
        if (typeof userInformation !== "string") {
            navigate("/home");
        }        
    }, []);

    // contactEmail
    //  The value of email field in Contact Us.    
    const [contactEmail, setContactEmail] = useState<string>("");

    // contactMessage
    //  The value of message field in Contact Us.        
    const [contactMessage, setContactMessage] = useState<string>("");

    // contactError
    //  The error that occured in the Contact Us form.   
    const [contactError, setContactError] = useState<string>("");

    // contactEmailChangeHandler
    //  Change the value of contactEmail whenever input in the form changed.    
    const contactEmailChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setContactEmail(event.target.value);
    }

    // contactMessageChangeHandler
    //  Change the value of contactMessage whenever input in the form changed.       
    const contactMessageChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setContactMessage(event.target.value);
    }

    // submitHandler
    //  Submit the form.
    const submitHandler = async (event : SyntheticEvent) => {
        event.preventDefault();

        alert("Successfully send message!");

        setContactEmail("");
        setContactMessage("");
    }    

    // carouselItems
    //  Array of objects contain all carousel image and text.
    const carouselItems = [
        {
            image: ambianceImage,
            text: "Unparalleled Cinematic Ambiance",
        },
        {
            image: comfortableImage,
            text: "Premium Comfort",
        },
        {
            image: projectionImage,
            text: "Cutting-Edge Projection and Sound",
        },                
    ];

    // carouselItem
    //  Carousel item that will be show on the screen.  
    const [carouselItem, setCarouselItems] = useState(carouselItems[0]);

    // useEffect
    //  Set carouselItem every 3,5 seconds
    useEffect(() => {
        let index = 0;
        setInterval(() => {
            index = (index + 1) % 3;
            setCarouselItems(carouselItems[index]);
        }, 3000);
    }, []);

    return (
        <main>
            <Header/>
            <section className = "flex justify-center items-center h-screen" id = "hero-section">
                <section>
                    <h1 className = "text-6xl font-bold text-center mb-0 text-slate-50"> Cinetix. </h1>
                    <h1 className = "text-4xl text-center mt-0 text-slate-50"> Your ultimate movie solution. </h1>
                </section>
            </section>

            <section className = "md:h-screen p-4">
                <h1 className = "text-4xl font-bold text-center"> Why Us? </h1>

                <section className = "mt-8">
                    <img
                        src = {carouselItem.image}
                        className = "block mx-auto w-2/3 md:w-1/3"
                    />  

                    <h1 className = "text-lg text-center">  {carouselItem.text} </h1>                    
                </section>

            </section>

            <section className = "md:h-screen p-4 flex justify-center items-center">
                
                <Form submit = {submitHandler}>
                    <h1 className = "text-2xl font-bold text-center"> Contact Us </h1>

                    <Input
                        label       = "Email"
                        inputType   = "email"
                        change      = {contactEmailChangeHandler}
                        placeholder = "Enter your email"
                        required    = {true}
                        value       = {contactEmail}

                    />

                    <Input
                        label       = "Message"
                        inputType   = "text"
                        change      = {contactMessageChangeHandler}
                        placeholder = "Enter your message"
                        required    = {true}
                        long        = {true}
                        value       = {contactMessage}
                    /> 

                    <Button
                        label       = "Submit"
                        type        = "submit"
                        center      = {true}
                        disabled    = {false}
                    />

                    <h1 className="text-red-600 font-bold"> {contactError} </h1>                       
                </Form>
            </section>            
        </main>
    );
}

export default Landing;