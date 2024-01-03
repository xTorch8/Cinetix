import React, {useEffect, useContext} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../components/Header";

import { AppContext } from "../context/app-context";

const MoviesDetail = () : JSX.Element => {
    const navigate = useNavigate();
    const { id } = useParams();

    // appContext
    //  Use app-context.tsx and retrieve userInformation, showtimesMovieList, showtimesList, theaterList
    const appContext = useContext(AppContext);
    const {userInformation, showtimesMovieList, showtimesList, theaterList} = appContext;    


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

    if (showtimesMovieList.length === 0 || showtimesList.length === 0 || theaterList.length === 0) {
        return <h1> Loading...</h1>; 
    }

    const movie = showtimesMovieList.filter((m) => {
        return (
            m.id === Number(id)
        )
    })[0];

    return (
        <main>
            <Header />

            <section className = "bg-slate-100 rounded-md drop-shadow-md mt-8 p-4">
                <section>
                    <h1 className = "text-2xl font-bold text-center"> {movie.title} </h1>
                </section>

                <section className = "flex flex-col lg:flex-row p-4">
                    <section className = "w-full lg:w-[12.5%]">
                        <img
                            className   = "w-1/2 block mx-auto lg:w-full"
                            src         = {movie.poster}
                        />
                    </section>

                    <section className = "w-full lg:w-[87.5%] lg:mx-8 mt-4 lg:mt-0">
                        <section className = "mt-8">
                            <table>
                                <tbody>
                                    <tr>
                                        <td className = "w-1/3"> Director </td>
                                        <td className = "w-2/3"> : {movie.director} </td>
                                    </tr>
                                    <tr>
                                        <td className = "w-1/3"> Release Date </td>
                                        <td className = "w-2/3"> : {movie.releaseDate.split("T")[0]} </td>
                                    </tr>
                                    <tr>
                                        <td className = "w-1/3"> Genre </td>
                                        <td className = "w-2/3"> : {movie.genre} </td>
                                    </tr>                                     
                                </tbody>
                            </table>
                        </section>

                        <section className = "mt-8">
                            <h1> {movie.description} </h1>
                        </section>
                    </section>
                </section>
            </section>

            <section className = "mt-8">
                <h1 className = "text-2xl font-bold text-center"> Trailer </h1>
                <iframe className = "block mx-auto my-8" allowFullScreen src = {movie.trailer} />   
            </section>

            <section className = "bg-slate-100 rounded-md drop-shadow-md mt-8 p-4">
                <h1 className = "text-2xl font-bold text-center"> Schedule </h1>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {theaterList.map((theater, index) => {
                        const filteredShowtimes = showtimesList
                            .filter((showtimes) => (
                                showtimes.moviesTitle === movie.title &&
                                showtimes.moviesDirector === movie.director &&
                                showtimes.theaterName === theater.name
                            ));

                        if (filteredShowtimes.length > 0) {
                            const groupedByDate : Record<string, { id : number, startTime: string; endTime: string }[]> = {};

                            filteredShowtimes.forEach((showtimes) => {
                                const dateKey = showtimes.date.split("T")[0];

                                if (!groupedByDate[dateKey]) {
                                    groupedByDate[dateKey] = [];
                                }

                                groupedByDate[dateKey].push({
                                    id: showtimes.id,
                                    startTime: showtimes.startTime,
                                    endTime: showtimes.endTime,
                                });
                            });

                            return (
                                <section key = {index} className = "bg-slate-200 rounded-md drop-shadow-md p-4 mt-4 lg:mt-8">
                                    <h1 className = "text-lg font-bold text-center"> {theater.name} - {theater.location} </h1>

                                    {Object.entries(groupedByDate).map(([date, schedules], index) => {
                                        return (
                                            <section key = {index}>
                                                <h1 className="mt-4"> {date} </h1>
                                                <section className = "grid grid-cols-4 gap-8">
                                                    {schedules.map((schedule, index) => {
                                                        return (
                                                            <section className = "w-full" key = {index}>
                                                                <button className = "bg-slate-100 w-full px-2 py-1 rounded-md drop-shadow-md hover:bg-slate-200"  onClick = {() => {
                                                                    navigate(`/buy-ticket/${schedule.id}`)
                                                                }}>
                                                                    {schedule.startTime.split(":")[0]}
                                                                    :
                                                                    {schedule.startTime.split(":")[1]}
                                                                </button>
                                                            </section>
                                                        )
                                                    })}                                                    
                                                </section>

                                            </section>                                            
                                        )
                                    })}
                                </section>
                            );
                        }

                        return <></>; 
                    })}
                </section>
                    

            </section>
        </main>
    );
}

export default MoviesDetail;