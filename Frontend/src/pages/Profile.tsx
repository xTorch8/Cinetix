import React, {useState, useEffect, useContext, ReactNode} from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import { AppContext } from "../context/app-context";
import Button from "../components/Button";
import GetTicketsUserAPI from "../data/api/tickets/GetTicketsUserAPI";


type userTicketsType = {
    userEmail           : string,
    theaterName         : string,
    movieTitle          : string,
    movieDirector       : string,
    showtimeDate       : string,
    showtimeStartTime  : string,
    showtimeEndTime    : string,
    seatNumber          : number,
}[]

interface ProfileProps {
    children? : ReactNode,
}

const Profile = (props : ProfileProps) : JSX.Element => {
    const navigate = useNavigate();
    // appContext
    //  Use app-context.tsx and retrieve userInformation, isFormActive,
    //  processDoneHandler, and formActiveHandler   
    const appContext = useContext(AppContext);
    const {userInformation, isFormActive, processDoneHandler, formActiveHandler} = appContext;

    // useEffect
    //  If the user is admin, redirect to /admin
    //  If the user haven't login, redirect to /login
    useEffect(() => {
        const checkAdminStatus = () => {
            if (typeof userInformation === "string") {
                return;
            }
    
            if (userInformation.isAdmin) {
                navigate("/admin");
            }

            formActiveHandler(false);
        };
    
        if (userInformation !== " ") {
            checkAdminStatus();
        }
    }, []);

    useEffect(() => {
        processDoneHandler(false);
    }, []);



    const [userTickets, setUserTickets] = useState<userTicketsType>([]);
    useEffect(() => {
        const fetchUserTicket = async () => {
            try {
                if (typeof userInformation !== "string") {
                    const data = await GetTicketsUserAPI(userInformation.email);

                    if (data.success) {
                        setUserTickets(data.tickets);
                    }
                }
                
            }
            catch (error) {
                console.error(error);
            }
        }

        fetchUserTicket();
    }, []);


    if (typeof userInformation === "string") {
        return <></>
    }

    return (
        <main>
            <Header />

            <section>
                <section className = "bg-sky-100 block mx-auto w-1/2 p-4 rounded-md drop-shadow-md mt-8">
                    <h1 className = "text-xl font-bold"> Hi, {userInformation.firstName}! </h1>
                </section>

                <section className = "bg-sky-100 mt-8 p-4 rounded-md drop-shadow-md block mx-auto w-3/4 lg:w-1/4">
                    <h1 className = "mb-0 text-center font-bold"> Your Balance </h1>
                    <h1 className = "mt-0 text-center"> {userInformation.balance} Credits </h1>  
                    <Button
                        label       = "Top Up"
                        center      = {true}
                        type        = "button"
                        disabled    = {isFormActive}
                        click       = {() => {navigate("/topup")}}
                    />                     
                </section>

                <section className = "mt-8">
                    
                    <details> 
                        <summary className = "text-2xl font-bold text-center"> Your's Tickets  </summary>
                    
                        <section className = "mt-8">
                            {userTickets.map((ticket, index) => {
                                return (
                                    <section 
                                        className   = "bg-slate-100 p-4 rounded-md drop-shadow-md w-3/4 lg:w-1/2 block mx-auto mt-4 "
                                        key         = {index}
                                    >
                                        <section>
                                            <h1 className = "text-lg font-bold text-center"> {ticket.theaterName} </h1>
                                        </section>    

                                        <section className = "mt-4">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className = "w-1/5"> Movie Title </td>
                                                        <td className = "w-4/5"> : {ticket.movieTitle} </td>
                                                    </tr>

                                                    <tr>
                                                        <td> Movie Director </td>
                                                        <td> : {ticket.movieDirector} </td>
                                                    </tr>

                                                    <tr>
                                                        <td> Showtimes </td>
                                                        <td> : {ticket.showtimeDate.split("T")[0]} </td>
                                                    </tr>

                                                    <tr>
                                                        <td> Start Time </td>
                                                        <td> : {ticket.showtimeStartTime} </td>
                                                    </tr>

                                                    <tr>
                                                        <td> End Time </td>
                                                        <td> : {ticket.showtimeEndTime} </td>
                                                    </tr>   
                                                    
                                                    <tr>
                                                        <td> Seats </td>
                                                        <td> : {ticket.seatNumber} </td>
                                                    </tr>                                                                    
                                                    <tr>
                                                        <td> Email </td>
                                                        <td> : {ticket.userEmail} </td>
                                                    </tr>                          
                                                </tbody>
                                            </table>
                                            <h1 className = "mt-4"> Please show this ticket to the officer. </h1>
                                        </section>
                                    </section>
                                )
                            })}
                        </section>                      
                    </details>
                </section>     
            </section>
            
            {props.children}

        </main>
    )
}

export default Profile;