import React, {useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";

import Header from "../components/Header";
import { AppContext } from "../context/app-context";

const Home = () : JSX.Element => {
    const navigate = useNavigate();

    // appContext
    //  Use app-context.tsx and retrieve userInformation, formActiveHandler, and showtimesMovieList   
    const appContext = useContext(AppContext);
    const {userInformation, formActiveHandler, showtimesMovieList} = appContext;

    // useEffect
    //  If the user is admin, redirect to /admin
    //  If the user haven't login, redirect to /login
    useEffect(() => {
        const checkAdminStatus = () => {
            if (typeof userInformation === "string") {
                navigate("/");
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

    return (
        typeof userInformation !== "string"
            ?
                <main>
                    <Header/>
        
                    <section className = "mt-8">
                        <section className = "bg-sky-100 w-1/3 mx-auto p-4 rounded-md drop-shadow-md">
                            <h1 className = "text-lg lg:text-2xl font-bold text-center"> Showtimes </h1>
                        </section>
                    </section>

                    <section className = "w-full lg:w-3/4 mx-auto p-8 grid grid-cols-2 lg:grid-cols-3 gap-8">
                        {showtimesMovieList.map((movie, index) => {
                            return (
                                <section 
                                    onClick     = {() => {navigate(`/movie/${movie.id}`)}}
                                    className   = "bg-slate-100 p-4 rounded-md drop-shadow-md hover:scale-105"
                                    key         = {index} 
                                >
                                    <img 
                                        className   = "w-full mx-auto"
                                        src         = {movie.poster}
                                    />
                                    <h1 className = "text-sm lg:text-lg font-bold text-center mt-2"> {movie.title} </h1>
                                </section>
                            )
                        })}
                    </section>

                </main>  
            :
                <></>
    )
}

export default Home;