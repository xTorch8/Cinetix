import React, {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import Admin from "../Admin";

import { AppContext } from "../../../context/app-context";
import Button from "../../../components/Button";

const Showtimes = () : JSX.Element => {
    const navigate = useNavigate();    
    // appContext
    //  Use app-context.tsx and retrieve userInformation, showtimesList, isFormActive, processDoneHandler    
    const appContext = useContext(AppContext);
    const {userInformation, showtimesList, isFormActive, processDoneHandler} = appContext;

    useEffect(() => {
        processDoneHandler(false);
    }, []);

    return (
        <Admin>
            <section className = "p-4 z-0">
                <h1 className = "text-2xl text-center font-bold"> Showtimes List </h1>  

                <Button 
                    label       = "Add Showtimes"
                    type        = "button"
                    center      = {false}
                    click       = {() => {navigate("/admin/showtimes/add-showtime")}}
                    disabled    = {isFormActive}
                />

                <section className = "bg-sky-100 w-full relative overflow-x-auto z-0 drop-shadow-md rounded-md">
                    <table className = "bg-sky-100 w-full border-collapse block drop-shadow-md rounded-md">
                        <thead>
                            <tr>
                                    <td className = "w-[5%] p-2"> No. </td>
                                    <td className = "w-[10%] p-2"> Theater Name </td>
                                    <td className = "w-[10%] p-2"> Movie Name </td>
                                    <td className = "w-[10%] p-2"> Movie Director </td>
                                    <td className = "w-[10%] p-2"> Movie Duration </td>
                                    <td className = "w-[10%] p-2"> Date </td>
                                    <td className = "w-[10%] p-2"> Start Time </td>
                                    <td className = "w-[10%] p-2"> End Time </td>
                                    <td className = "w-[10%] p-2"> Ticket Price </td>
                                    <td className = "w-[15%] p-2"> Action </td>                            
                            </tr>

                        </thead>

                        <tbody>
                            {showtimesList.map((showtimes, index) => {
                                return (
                                    <tr className = "even:bg-sky-100 odd:bg-white p-2" key = {index}>
                                        <td className = "p-2"> {index + 1} </td>
                                        <td className = "p-2"> {showtimes.theaterName }</td>
                                        <td className = "p-2"> {showtimes.moviesTitle} </td>
                                        <td className = "p-2"> {showtimes.moviesDirector} </td>
                                        <td className = "p-2"> {showtimes.moviesDuration} </td>
                                        <td className = "p-2"> {showtimes.date.split("T")[0]} </td>
                                        <td className = "p-2"> {showtimes.startTime} </td>
                                        <td className = "p-2"> {showtimes.endTime} </td>
                                        <td className = "p-2"> {showtimes.ticketPrice} </td>
                                        <td className = "p-2 flex flex-row">
                                            <section className = "mx-2">
                                                <Button 
                                                    click       = {() => {navigate(`/admin/showtimes/edit-showtime/${showtimes.id}`)}}
                                                    key         = {String(showtimes.id)}
                                                    label       = "Edit"
                                                    type        = "button"
                                                    center      = {false}
                                                    color       = "bg-yellow-400"
                                                    hover       = "hover:bg-yellow-600"
                                                    disabled    = {isFormActive}
                                                />
                                            </section>

                                            <section className = "mx-2">
                                                <Button
                                                    click       = {() => {navigate(`/admin/showtimes/delete-showtime/${showtimes.id}`)}}
                                                    key         = {String(showtimes.id)} 
                                                    label       = "Delete"
                                                    type        = "button"
                                                    center      = {false}
                                                    color       = "bg-red-400"
                                                    hover       = "hover:bg-red-600"                                                
                                                    disabled    = {isFormActive}   
                                                />                                                 
                                            </section>
                                       
                                        </td>
                                    </tr>
                                )
                            })}
                            {
                                showtimesList.length === 0
                                ? 
                                    <tr className = "bg-white p-2">
                                        <td colSpan = {10}> No showtimes. </td>
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

export default Showtimes;