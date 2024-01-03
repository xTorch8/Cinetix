import React, {useState, useEffect, useContext} from "react";
import { useNavigate, useParams} from "react-router-dom";

import Header from "../components/Header";
import Button from "../components/Button";

import { AppContext } from "../context/app-context";
import GetTicketsShowtimeAPI from "../data/api/tickets/GetTicketsShowtimeAPI";
import BuyTicketsAPI from "../data/api/tickets/BuyTicketsAPI";
import GetTicketsUserAPI from "../data/api/tickets/GetTicketsUserAPI";



type seatsType =  {
    id          : number,
    userId      : number,
    showtimeId  : number,
    seatNumber  : number,
}[];

const BuyTicket = () : JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();

    // appContext
    //  Use app-context.tsx and retrieve userInformation, showtimesLIst, and theaterList   
    const appContext = useContext(AppContext);
    const {
        userInformation, 
        showtimesList,
        theaterList,
        processDoneHandler,
        isProcessDone
    } = appContext; 
        
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
        };
    
        if (userInformation !== " ") {
            checkAdminStatus();
        }
    }, []);

    // seats
    //  List of seats in this showtime.
    const [seats, setSeats] = useState<seatsType>([]);

    // chosenSeats
    //  List of seats that the user chose.
    const [chosenSeats, setChosenSeats] = useState<number[]>([]);

    const [error, setError] = useState<string>("");

    // success
    //  Deterime is the transaction success or not.
    const [success, setSuccess] = useState<boolean>();  

    const fetchShowtimeSeats = async () => {
        const data = await GetTicketsShowtimeAPI(Number(id));
        if (data.success) {
            setSeats(data.tickets);
        }
    }

    useEffect(() => {
        fetchShowtimeSeats();  
    }, [success]);

     
    if (showtimesList.length === 0 || theaterList.length == 0) {
        return <h1> Loading... </h1>
    }    
    
    // showtimes
    //  Filter showtimes based on id.
    const showtimes = showtimesList.filter((showtime) => {
        return (
            showtime.id === Number(id)
        )
    })[0];

    // seatTotal
    //  Determine how many seat is on the theater.
    const seatTotal = new Array(theaterList.filter((theaters) => {
        return (
            theaters.name === showtimes.theaterName
        )
    })[0].capacity).fill(0);

    const buyticketHandler = async () => {
        try {
            if (typeof userInformation !== "string") {

                let isAllSuccess = true;
                if (userInformation.balance >= chosenSeats.length * showtimes.ticketPrice) {
                    for (let i = 0; chosenSeats.length > i; i++) {
                        const data = await BuyTicketsAPI(userInformation.email, showtimes.theaterName, showtimes.moviesTitle, showtimes.moviesDirector, showtimes.date, showtimes.startTime, chosenSeats[i]);  
                        
                        if (data.success) {
                            setSuccess(true);
                        }
                        else {
                            setError(data.error);
                            setSuccess(false);
                            isAllSuccess = false;
                        }
                    }

                    if (isAllSuccess) {
                        setChosenSeats([]);
                        processDoneHandler(true);           
                        setSuccess(true);          
                        fetchShowtimeSeats();   
                    }

                }
                else {
                    setError("Your balance is not enough");
                    
                }
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <main>
            <Header />

            <section className = "bg-slate-100 mt-8 p-4 rounded-md drop-shadow-md">
                <h1 className = "text-2xl font-bold text-center"> Buy Tickets </h1>

                <section className = "mt-4">
                    <table>
                        <tbody>
                            <tr>
                                <td className = "w-1/5"> Movies </td>
                                <td className = "w-4/5"> : {showtimes.moviesTitle} </td>
                            </tr>

                            <tr>
                                <td> Director </td>
                                <td> : {showtimes.moviesDirector} </td>
                            </tr> 

                            <tr>
                                <td> Theater </td>
                                <td> : {showtimes.theaterName} - {showtimes.theaterLocation} </td>
                            </tr> 

                            <tr>
                                <td> Date </td>
                                <td> : {showtimes.date.split("T")[0]} </td>
                            </tr>                                   

                            <tr>
                                <td> Start Time </td>
                                <td> 
                                    : {showtimes.startTime.split(":")[0]}:{showtimes.startTime.split(":")[1]} 
                                </td>
                            </tr>

                            <tr>
                                <td> End Time </td>
                                <td> 
                                    : {showtimes.endTime.split(":")[0]}:{showtimes.endTime.split(":")[1]} 
                                </td>
                            </tr>

                            <tr>
                                <td> Ticket Price </td>
                                <td> 
                                    : {showtimes.ticketPrice} Credits
                                </td>
                            </tr>                                                                               
                        </tbody>
                    </table>
                </section>
                
                <section>
                    <h1 className = "text-lg font-bold text-center"> Seats </h1>

                    <section className = "bg-slate-400 w-1/2 block mx-auto">
                        <h1 className = "text-center"> Screen </h1>
                    </section>

                    <section className = "grid grid-cols-5 gap-2 w-1/2 mx-auto mt-8">
                        {
                            seatTotal.map((seat, index : number) => {

                                const isFilled = seats.some(obj => obj.seatNumber === index + 1);
                                if (isFilled) {
                                    return (
                                        <button className = "bg-red-500" key = {index} disabled>
                                            {index + 1}
                                        </button>
                                    )                                    
                                }

                                return (
                                    <button 
                                        onClick     = {() => {
                                            setChosenSeats(prevSeats => {
                                                if (prevSeats.includes(index + 1)) {
                                                  return prevSeats.filter(seatNum => seatNum !== index + 1);
                                                } 
                                                else {
                                                  return [...prevSeats, index + 1];
                                                }
                                            });

                                            setSuccess(false);
                                        }}
                                        className   = {chosenSeats.includes(index + 1) ? "bg-yellow-500 hover:bg-yellow-600" : "bg-slate-200 hover:bg-slate-300"}
                                        key         = {index}
                                    >
                                        {index + 1}
                                    </button>
                                )
                            })
                        }                        
                    </section>
                </section>
            </section>

            <section className = "bg-slate-100 rounded-md drop-shadow-md mt-8 p-4">
                <h1 className = "text-2xl font-bold text-center"> Bills </h1>

                <section className = "p-8">
                    <table>
                        <tbody>
                            <tr>
                                <td className = "w-1/5"> Seats chosen </td>
                                <td className = "w-4/5">  
                                    : 
                                    {
                                        chosenSeats.length === 0
                                        ? 
                                            <span> - </span>
                                        : 
                                        chosenSeats.map((seat, index) => {
                                            return (
                                                <span key = {index}> {seat} </span>
                                            )
                                        })                                      
                                    }
                                    
                                  
                                </td>
                            </tr>

                            <tr>
                                <td> Total price </td>
                                <td> : {chosenSeats.length * showtimes.ticketPrice} Credits </td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section>
                    <Button
                        label       = "Buy"
                        type        = "button"
                        center      = {true}
                        color       = "bg-green-400 disabled:bg-slate-200"
                        hover       = "hover:bg-green-600"
                        disabled    = {chosenSeats.length === 0}
                        click       = {buyticketHandler}
                    />

                    {
                        success === true 
                        ?
                            <h1> Success! </h1>
                        :
                            <h1 className = "font-bold text-red-600"> {error} </h1>
                    }
                    
                </section>                
            </section> 

           
        </main>
    );
}

export default BuyTicket;