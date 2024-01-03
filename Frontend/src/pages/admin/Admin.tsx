import React, { ReactNode, useContext, useEffect } from "react";
import {useNavigate} from "react-router-dom";

import Header from "../../components/Header";
import Button from "../../components/Button";

import { AppContext } from "../../context/app-context";

interface AdminProps {
    children?   : ReactNode
}

const Admin = (props : AdminProps) : JSX.Element => {
    const navigate = useNavigate();

    // appContext
    //  Use app-context.tsx and retrieve userInformation and isFormActive    
    const appContext = useContext(AppContext);
    const {userInformation, isFormActive, formActiveHandler} = appContext;


    const checkAdminStatus = () => {
        if (typeof userInformation === "string") {
            navigate("/");
            return;
        }

        if (!userInformation.isAdmin) {
            navigate("/");
        }

        formActiveHandler(false);
    };

    if (userInformation !== "") {
        checkAdminStatus();
    }

    return (
        <>
            <Header />
            
            <section className = "mt-4">
                <section className = "flex w-1/2 lg:w-full mt-2 p-4">
                    <section className = "mx-2">
                        <Button
                            label       = "Movies"
                            type        = "button"
                            center      = {false}
                            click       = {() => {navigate("/admin/movies")}}
                            disabled    = {isFormActive}
                        />                        
                    </section>

                    <section className = "mx-2">
                        <Button
                            label       = "Showtimes"
                            type        = "button"
                            center      = {false}
                            click       = {() => {navigate("/admin/showtimes")}}
                            disabled    = {isFormActive}
                        />                        
                    </section>

                    <section className = "mx-2">
                        <Button
                            label       = "Theaters"
                            type        = "button"
                            center      = {false}
                            click       = {() => {navigate("/admin/theaters")}}
                            disabled    = {isFormActive}
                        />                        
                    </section>                    
                </section>

                {props.children}                
            </section>
        </>
    );
}

export default Admin;
