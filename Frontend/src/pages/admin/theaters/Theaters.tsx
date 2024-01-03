import React, {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import Admin from "../Admin";

import { AppContext } from "../../../context/app-context";
import Button from "../../../components/Button";

const Theaters = () : JSX.Element => {
    const navigate = useNavigate();    
    // appContext
    //  Use app-context.tsx and retrieve theaterList, isFormActive, processDoneHandler    
    const appContext = useContext(AppContext);
    const {theaterList, isFormActive, processDoneHandler} = appContext;

    useEffect(() => {
        processDoneHandler(false);
    }, []);

    return (
        <Admin>
            <section className = "p-4 z-0">
                <h1 className = "text-2xl text-center font-bold"> Theater List </h1>  

                <section className = "w-full z-0 mt-8">
                    <table className = "bg-sky-100 w-full border-collapse drop-shadow-md rounded-md">
                        <thead>
                            <tr>
                                <td className = "w-1/12 p-2"> No. </td>
                                <td className = "w-3/12 p-2"> Name </td>
                                <td className = "w-3/12 p-2"> Location </td>
                                <td className = "w-3/12 p-2"> Capacity </td>                          
                            </tr>

                        </thead>

                        <tbody>
                            {theaterList.map((theater, index) => {
                                return (
                                    <tr className = "even:bg-sky-100 odd:bg-white p-2" key = {index}>
                                        <td className = "p-2"> {index + 1} </td>
                                        <td className = "p-2"> {theater.name} </td>
                                        <td className = "p-2"> {theater.location} </td>
                                        <td className = "p-2"> {String(theater.capacity)} </td>
                                    </tr>
                                )
                            })}
                            {
                                theaterList.length === 0
                                ? 
                                    <tr className = "bg-white p-2">
                                        <td colSpan = {4}> No theaters. </td>
                                    </tr>
                                :
                                    <></>    
                            }
                        </tbody>
                    </table>                    
                </section>
            </section>
        </Admin>
    );
}

export default Theaters;