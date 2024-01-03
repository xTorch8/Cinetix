import React, {useState, useEffect, useContext, ChangeEvent, SyntheticEvent} from "react";
import { useNavigate, useParams } from "react-router-dom";

import Showtimes from "./Showtimes";

import Header from "../../../components/Header";
import Form from "../../../components/Form";
import Input from "../../../components/Input";
import InputOption from "../../../components/InputOption";
import Button from "../../../components/Button";

import { AppContext } from "../../../context/app-context";

import EditShowtimesAPI from "../../../data/api/showtimes/EditShowtimesAPI";

const EditShowtimes = () : JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();

    // appContext
    //  Use app-context.tsx and retrieve userInformation, formActiveHandler, 
    //  processDoneHandler, theaterList, and movieList    
    const appContext = useContext(AppContext);
    const {
        userInformation, 
        formActiveHandler, 
        processDoneHandler,
        theaterList,
        moviesList,
        showtimesList
    } = appContext; 

    useEffect(() => {
        formActiveHandler(true);
    }, []);

    // theaterName
    //  The value of theaterName field.      
    const [theaterName, setTheaterName] = useState<string>("");

    // movieName
    //  The value of movieTitle field.      
    const [movieTitle, setMovieTitle] = useState<string>("");

    // movieDirector
    //  The value of movieDirector field.    
    const [movieDirector, setMovieDirector] = useState<string>("");

    // date
    //  The value of date field.     
    const [date, setDate] = useState<string>("");

    // startTime
    //  The value of startTime field.
    const [startTime, setStartTime] = useState<string>("");

    // ticketPrice
    //  The value of startTime field.
    const [ticketPrice, setTicketPrice] = useState<string>("");

    const [error, setError] = useState<string>("");

    // useEffect
    //  Set all of the showtimes information based on Id.
    useEffect(() => {
        const showtimesById = showtimesList.filter((s) => {
            return (
                s.id === Number(id)
            );
        });

        if (showtimesById.length === 1) {
            setTheaterName(showtimesById[0].theaterName);
            setMovieTitle(showtimesById[0].moviesTitle);
            setMovieDirector(showtimesById[0].moviesDirector);
            setDate(showtimesById[0].date.split("T")[0]);
            setStartTime(showtimesById[0].startTime);
            setTicketPrice(String(showtimesById[0].ticketPrice));            
        }
    }, [theaterList, moviesList]);

    //  Set the value of movieDirector based on moviesList.
    useEffect(() => {
        if (moviesList.length > 0) {
            const selectedMovie = moviesList.find(movie => movie.title === movieTitle);
            if (selectedMovie) {
                setMovieDirector(selectedMovie.director);
            }
        }
    }, [moviesList, movieTitle]);        

    // theaterNameChangeHandler
    //  Change the value of theaterName whenever input in the form changed.
    const theaterNameChangeHandler = (event : ChangeEvent<HTMLSelectElement>) => {
        setTheaterName(event.target.value);
    }

    // movieNameChangeHandler
    //  Change the value of movieName whenever input in the form changed.
    const movieTitleChangeHandler = (event : ChangeEvent<HTMLSelectElement>) => {
        setMovieTitle(event.target.value);
    }

    // movieDirectorChangeHandler
    //  Change the value of movieDirector whenever input in the form changed.
    const movieDirectorChangeHandler = (event : ChangeEvent<HTMLSelectElement>) => {
        setMovieDirector(event.target.value);
    }    

    // dateChangeHandler
    //  Change the value of date whenever input in the form changed.
    const dateChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setDate(event.target.value);
    }

    // startTimeChangeHandler
    //  Change the value of startTime whenever input in the form changed.
    const startTimeChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setStartTime(event.target.value);
    }  
    
    // ticketPriceChangeHandler
    //  Change the value of startTime whenever input in the form changed.
    const ticketPriceChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setTicketPrice(event.target.value);
    }     

    const submitHandler = async (event : SyntheticEvent) => {
        event.preventDefault();
        try {
            if (typeof userInformation !== "string") {
                const userEmail = userInformation.email;

                const data      = await EditShowtimesAPI(Number(id), userEmail, movieTitle, movieDirector, theaterName, date, startTime, Number(ticketPrice));  

                if (data.success) {
                    navigate("/admin/showtimes");
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
            setError("Server error");
            console.error(error);
        }
    }


    return (
        <main>
            <section className = "relative lg:hidden opacity-20">
                <Header/>
            </section>

            <section className = "relative hidden lg:block  opacity-20">
                <Showtimes />
            </section>


            <section className = "lg:fixed w-full z-1 lg:top-[5%]">
                <Form submit = {submitHandler}>
                    <section className = "flex items-center">
                        <section className = "w-[95%]">
                            <h1 className = "text-2xl font-bold text-center"> Edit Showtimes </h1>    
                        </section>
                        <section className = "w-[5%]">
                            <h1 
                                className   = "cursor-pointer hover:text-red-600"
                                onClick     = {() => {formActiveHandler(false); navigate("/admin/showtimes")}}
                            > 
                                X 
                            </h1>      
                        </section>  
                    </section>
        
                    <InputOption 
                        label       = "Theaters"
                        required    = {true}
                        list        = {theaterList}
                        element     = "name"
                        change      = {theaterNameChangeHandler}
                        value       = {theaterName}
                    />

                    <InputOption 
                        label       = "Movies"
                        required    = {true}
                        list        = {moviesList}
                        element     = "title"
                        change      = {movieTitleChangeHandler}
                        value       = {movieTitle}
                    />

                    <InputOption 
                        label       = "Director"
                        required    = {true}
                        list        = {moviesList.filter((movie) => {return (movie.title === movieTitle)})}
                        element     = "director"
                        change      = {movieDirectorChangeHandler}
                        value       = {movieDirector}
                    />                    

                    <Input 
                        label       = "Date"
                        inputType   = "date"
                        change      = {dateChangeHandler}
                        placeholder = ""
                        value       = {date}
                        required    = {true}
                    />

                    <Input
                        label       = "Start Time"
                        inputType   = "time"
                        change      = {startTimeChangeHandler}
                        placeholder = ""
                        value       = {startTime}
                        required    = {true}                    
                    />

                    <Input
                        label       = "Ticket Price"
                        inputType   = "number"
                        change      = {ticketPriceChangeHandler}
                        placeholder = ""
                        value       = {ticketPrice}
                        required    = {true}                    
                    />

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

export default EditShowtimes;