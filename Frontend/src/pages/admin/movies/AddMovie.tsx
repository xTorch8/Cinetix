import React, {useState, useEffect, useContext, ChangeEvent, SyntheticEvent} from "react";
import { useNavigate } from "react-router-dom";

import Movies from "./Movies";

import Form from "../../../components/Form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

import { AppContext } from "../../../context/app-context";
import Header from "../../../components/Header";
import AddMovieAPI from "../../../data/api/movies/AddMovieAPI";
import { AxiosError } from "axios";

const AddMovie = () : JSX.Element => {
    const navigate = useNavigate();

    // appContext
    //  Use app-context.tsx and retrieve userInformation, formActiveHandler, and processDoneHandler    
    const appContext = useContext(AppContext);
    const {userInformation, formActiveHandler, processDoneHandler} = appContext; 

    useEffect(() => {
        formActiveHandler(true);
    }, []);
    
    // title
    //  The value of title field.    
    const [title, setTitle] = useState<string>("");

    // director
    //  The value of director field.    
    const [director, setDirector] = useState<string>("");

    // genre
    //  The value of genre field.    
    const [genre, setGenre] = useState<string>("");

    // releaseDate
    //  The value of releaseDate field.       
    const [releaseDate, setReleaseDate] = useState<string>("");

    // durationHours
    //  The value of duration hours field.       
    const [durationHours, setDurationHours] = useState<string>("");

    // durationMinutes
    //  The value of duration minutes field.       
    const [durationMinutes, setDurationMinutes] = useState<string>("");

    // durationSeconds
    //  The value of duration seconds field.       
    const [durationSeconds, setDurationSeconds] = useState<string>("");

    // description
    //  The value of description field.       
    const [description, setDescription] = useState<string>("");

    // poster
    //  The value of poster field.       
    const [poster, setPoster] = useState<string>("");

    // trailer
    //  The value of trailer field.       
    const [trailer, setTrailer] = useState<string>("");

    const [error, setError] = useState("");

    // titleChangeHandler
    //  Change the value of title whenever input in the form changed.
    const titleChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }

    // directorChangeHandler
    //  Change the value of director whenever input in the form changed.
    const directorChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setDirector(event.target.value);
    }
    
    // genreChangeHandler
    //  Change the value of genre whenever input in the form changed.
    const genreChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setGenre(event.target.value);
    }
    
    // releaseDateChangeHandler
    //  Change the value of releaseDate whenever input in the form changed.
    const releaseDateChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setReleaseDate(event.target.value);
    }

    // durationHoursChangeHandler
    //  Change the value of durationHours whenever input in the form changed.    
    const durationHoursChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setDurationHours(event.target.value);
    }

    // durationMinutesChangeHandler
    //  Change the value of durationMinutes whenever input in the form changed.    
    const durationMinutesChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setDurationMinutes(event.target.value);
    }    

    // durationSecondsChangeHandler
    //  Change the value of durationMinutes whenever input in the form changed.    
    const durationSecondsChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setDurationSeconds(event.target.value);
    }      
    
    // descriptionChangeHandler
    //  Change the value of description whenever input in the form changed.
    const descriptionChangeHandler = (event : ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    }  
    
    // posterChangeHandler
    //  Change the value of poster whenever input in the form changed.
    const posterChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setPoster(event.target.value);
    }
    
    // trailerChangeHandler
    //  Change the value of poster whenever input in the form changed.
    const trailerChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        setTrailer(event.target.value);
    }            

    // submitHandler
    //  Submit the form and get the response.
    const submitHandler = async (event : SyntheticEvent) => {
        event.preventDefault();
        try {
            if (typeof userInformation !== "string") {
                const userEmail = userInformation.email;

                const data      = await AddMovieAPI(userEmail, title, genre, releaseDate, director, durationHours, durationMinutes, durationSeconds, description, poster, trailer);  

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


            <section className = "lg:fixed w-full z-1 lg:top-[1%]">
                <Form submit = {submitHandler}>
                    <section className = "flex items-center">
                        <section className = "w-[95%]">
                            <h1 className = "text-2xl font-bold text-center"> Add Movie </h1>    
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
                    
                    
                    <Input 
                        label       = "Title"
                        inputType   = "text"
                        change      = {titleChangeHandler}
                        placeholder = ""
                        required    = {true}
                    />

                    <Input 
                        label       = "Director"
                        inputType   = "text"
                        change      = {directorChangeHandler}
                        placeholder = ""
                        required    = {true}
                    />                    

                    <Input 
                        label       = "Genre"
                        inputType   = "text"
                        change      = {genreChangeHandler}
                        placeholder = ""
                        required    = {true}
                    />

                    <Input 
                        label       = "Release Date"
                        inputType   = "date"
                        change      = {releaseDateChangeHandler}
                        placeholder = ""
                        required    = {true}
                    /> 

                    <section className = "flex flex-col lg:flex-row mt-4">
                        <section className = "w-full lg:w-[30%]">
                            <h1 className = "lg:text-right lg:mx-4"><span className = "font-bold text-red-600"> * </span> Duration </h1>    
                        </section>
                        
                        <section className = "flex">
                            <section>
                                <section>
                                    <input 
                                        onChange    = {durationHoursChangeHandler}
                                        type        = "number" 
                                        min         = "0" 
                                        max         = "23" 
                                        required
                                    />
                                </section>

                                <section>
                                    <h1 className = "text-sm text-gray-500"> Hours </h1>
                                </section>
                            </section>

                            <section className = "mx-2">
                                <section>
                                    <input 
                                        onChange    = {durationMinutesChangeHandler}
                                        type        = "number" 
                                        min         = "0" 
                                        max         = "59" 
                                        required
                                    />
                                </section>

                                <section>
                                    <h1 className = "text-sm text-gray-500"> Minutes </h1>
                                </section>
                            </section>

                            <section>
                                <section>
                                    <input 
                                        onChange    = {durationSecondsChangeHandler}
                                        type        = "number" 
                                        min         = "0" 
                                        max         = "59" 
                                        required
                                    />
                                </section>

                                <section>
                                    <h1 className = "text-sm text-gray-500"> Seconds </h1>
                                </section>
                            </section>
                        </section>
                    </section>

                    <Input 
                        label       = "Description"
                        inputType   = "text"
                        change      = {descriptionChangeHandler}
                        placeholder = ""
                        required    = {true}
                        long        = {true}
                    />

                    <Input 
                        label       = "Poster URL"
                        inputType   = "url"
                        change      = {posterChangeHandler}
                        placeholder = ""
                        required    = {true}
                    />    

                    <Input 
                        label       = "Trailer URL"
                        inputType   = "url"
                        change      = {trailerChangeHandler}
                        placeholder = ""
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

export default AddMovie;