import React, {useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";

import Admin from "../Admin";

import { AppContext } from "../../../context/app-context";
import Button from "../../../components/Button";



const Movies = () : JSX.Element => {
    const navigate = useNavigate();    
    // appContext
    //  Use app-context.tsx and retrieve moviesList, isFormActive, processDoneHandler    
    const appContext = useContext(AppContext);
    const {moviesList, isFormActive, processDoneHandler} = appContext;

    useEffect(() => {
        processDoneHandler(false);
    }, []);

    return (
        <Admin>
            <section className = "p-4 z-0">
                <h1 className = "text-2xl text-center font-bold"> Movies List </h1>  

                <Button 
                    label       = "Add Movie"
                    type        = "button"
                    center      = {false}
                    click       = {() => {navigate("/admin/movies/add-movie")}}
                    disabled    = {isFormActive}
                />

                <section className = "bg-sky-100 w-full relative overflow-x-auto z-0 drop-shadow-md rounded-md">
                    <table className = "bg-sky-100 w-full border-collapse block drop-shadow-md rounded-md">
                        <thead>
                            <tr>
                                    <td className = "w-[5%] p-2"> No. </td>
                                    <td className = "w-[10%] p-2"> Poster </td>
                                    <td className = "w-[10%] p-2"> Title </td>
                                    <td className = "w-[10%] p-2"> Director </td>
                                    <td className = "w-[10%] p-2"> Genre </td>
                                    <td className = "w-[15%] p-2"> Release Date </td>
                                    <td className = "w-[10%] p-2"> Duration </td>
                                    <td className = "w-[25%] p-2"> Description </td>
                                    <td className = "w-[5%] p-2"> Trailer </td>
                                    <td className = "w-[10%] p-2"> Action </td>                            
                            </tr>

                        </thead>

                        <tbody>
                            {moviesList.map((movie, index) => {
                                return (
                                    <tr className = "even:bg-sky-100 odd:bg-white p-2" key = {index}>
                                        <td className = "p-2"> {index + 1} </td>
                                        <td className = "p-2"> 
                                            <img
                                                className   = "w-full"
                                                src         = {movie.poster}
                                            />
                                        </td>
                                        <td className = "p-2"> {movie.title} </td>
                                        <td className = "p-2"> {movie.director} </td>
                                        <td className = "p-2"> {movie.genre} </td>
                                        <td className = "p-2"> {movie.releaseDate.split("T")[0]} </td>
                                        <td className = "p-2"> {movie.duration} </td>
                                        <td className = "p-2 text-justify"> {movie.description} </td>
                                        <td>
                                            <iframe src = {movie.trailer} allowFullScreen>

                                            </iframe>
                                        </td>
                                        <td className = "p-2 flex flex-row">
                                            <section className = "mx-2">
                                                <Button 
                                                    click       = {() => {navigate(`/admin/movies/edit-movie/${movie.id}`)}}
                                                    key         = {String(movie.id)}
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
                                                    click       = {() => {navigate(`/admin/movies/delete-movie/${movie.id}`)}}
                                                    key         = {String(movie.id)} 
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
                                moviesList.length === 0
                                ? 
                                    <tr className = "bg-white p-2">
                                        <td colSpan = {9}> No movie. </td>
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

export default Movies;