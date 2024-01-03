import React, {useState, useEffect, useContext, ChangeEvent, SyntheticEvent} from "react";
import { useParams, useNavigate } from 'react-router-dom';

import Movies from "./Movies";

import Header from "../../../components/Header";
import Form from "../../../components/Form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

import { AppContext } from "../../../context/app-context";


import EditMovieAPI from "../../../data/api/movies/EditMovieAPI";


const EditMovie = () : JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();

    // appContext
    //  Use app-context.tsx and retrieve userInformation, formActiveHandler, processDoneHandler, moviesList    
    const appContext = useContext(AppContext);
    const {userInformation, formActiveHandler, processDoneHandler, moviesList} = appContext; 

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

    // useEffect
    //  Set all of the movie information based on Id.
    useEffect(() => {
        const movieById = moviesList.filter((m) => {
            return (
                m.id === Number(id)
            );
        });

        if (movieById.length === 1) {
            setTitle(movieById[0].title);
            setGenre(movieById[0].genre);
            setReleaseDate(movieById[0].releaseDate.split("T")[0]);
            setDirector(movieById[0].director);
            setDurationHours(movieById[0].duration.split(":")[0]);
            setDurationMinutes(movieById[0].duration.split(":")[1]);
            setDurationSeconds(movieById[0].duration.split(":")[2]); 
            setDescription(movieById[0].description);
            setPoster(movieById[0].poster);
            setTrailer(movieById[0].trailer);                  
        }
      
    }, []);


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

                const data      = await EditMovieAPI(Number(id), userEmail, title, genre, releaseDate, director, durationHours, durationMinutes, durationSeconds, description, poster, trailer);  

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


            <section className = "lg:fixed w-full z-1 top-[1%]">
                <Form 
                    submit    = {submitHandler}
                >
                    <section className = "flex items-center">
                        <section className = "w-[95%]">
                            <h1 className = "text-2xl font-bold text-center"> Edit Movie </h1>    
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
                        value       = {title}
                        required    = {true}
                    />

                    <Input 
                        label       = "Director"
                        inputType   = "text"
                        change      = {directorChangeHandler}
                        placeholder = ""
                        value       = {director}
                        required    = {true}
                    />                    


                    <Input 
                        label       = "Genre"
                        inputType   = "text"
                        change      = {genreChangeHandler}
                        placeholder = ""
                        value       = {genre}
                        required    = {true}
                    />

                    <Input 
                        label       = "Release Date"
                        inputType   = "date"
                        change      = {releaseDateChangeHandler}
                        placeholder = ""
                        value       = {releaseDate}
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
                                        value       = {Number(durationHours)}
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
                                        value       = {Number(durationMinutes)}
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
                                        value       = {Number(durationSeconds)}
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
                        value       = {description}
                        required    = {true}
                        long        = {true}
                    />

                    <Input 
                        label       = "Poster URL"
                        inputType   = "url"
                        change      = {posterChangeHandler}
                        placeholder = ""
                        value       = {poster}
                        required    = {true}
                    />    

                    <Input 
                        label       = "Trailer URL"
                        inputType   = "url"
                        change      = {trailerChangeHandler}
                        placeholder = ""
                        value       = {trailer}
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

export default EditMovie;