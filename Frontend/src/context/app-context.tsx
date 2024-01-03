import React, {useState, useEffect, createContext, ReactNode} from "react";
import GetMoviesAPI from "../data/api/movies/GetMoviesAPI";
import GetShowtimesAPI from "../data/api/showtimes/GetShowtimesAPI";
import GetTheatersAPI from "../data/api/theaters/GetTheatersAPI";
import LoginAPI from "../data/api/users/LoginAPI";
import GetUserInformationAPI from "../data/api/users/GetUserInformationAPI";

type userInformationType = {
    firstName   : string,
    lastName    : string,
    email       : string,
    balance     : number,
    isAdmin     : boolean,
}

type moviesListType = {
    id              : number,
    title           : string,
    genre           : string,
    releaseDate     : string,
    director        : string,
    duration        : string,
    description     : string,
    poster          : string,
    trailer         : string,
}[];

type theaterListType = {
    id              : number,
    name            : string,
    location        : string,
    capacity        : number,
}[];

type showtimesListType = {
    id                      : number,
    theaterName             : string,
    theaterLocation         : string,
    moviesTitle             : string,
    moviesReleaseDate       : string,
    moviesDirector          : string,
    moviesDuration          : string,
    moviesPoster            : string,
    moviesTrailer           : string,
    moviesDescription       : string,
    date                    : string,
    startTime               : string,
    endTime                 : string,
    ticketPrice             : number
}[];

interface AppContextType {
    userInformation             : string | userInformationType,
    setUserInformationHandler   : (informations : userInformationType | string) => void,
    isProcessDone               : boolean,
    processDoneHandler          : (condition : boolean) => void,
    moviesList                  : moviesListType,
    theaterList                 : theaterListType,
    showtimesList               : showtimesListType,
    showtimesMovieList          : moviesListType,
    isFormActive                : boolean,
    formActiveHandler           : (condition : boolean) => void,
}

const AppContext = createContext<AppContextType>({
    userInformation             : "",
    setUserInformationHandler   : () => {},
    isProcessDone               : false,
    processDoneHandler          : () => {},
    moviesList                  : [],
    theaterList                 : [],
    showtimesList               : [],
    showtimesMovieList          : [],
    isFormActive                : false,
    formActiveHandler           : () => {},
});

const AppContextProvider = ({children} : {children : ReactNode}) => {
    // userInformation
    //  Store all of the user informations.
    const [userInformation, setUserInformation] = useState<string | userInformationType>("");

    // useEffect
    //  Try to get "userInformation" from the sessionStorage.
    //  If found (user successfully login), set the value of userInformation.
    useEffect(() => {
        const storedUserInformation = sessionStorage.getItem("userInformation");
        if (storedUserInformation !== null) {
            setUserInformation(JSON.parse(storedUserInformation));    
        }
        else {
            setUserInformation(" ");
        } 
    }, []);

    // setUserInformationHandler
    //  Set the value of userInformation (outside the useEffect)
    const setUserInformationHandler = (informations : userInformationType | string) => {
        setUserInformation(informations);
    }

    // isProcessDone
    //  Deterime whether the CUD proccess done.
    //  If the process done, the value will be true.
    //  If the process done, the value will be false.
    const [isProcessDone, setIsProccessDone] = useState<boolean>(false);
    
    // processDoneHandler
    //  Set the value of isProcessDone
    const processDoneHandler = (condition : boolean) => {
        setIsProccessDone(condition);
    }

    // moviesList
    //  Store all of the movie list.
    const [moviesList, setMoviesList] = useState<moviesListType>([]);

    // theaterList
    //  Store all of the theater list.
    const [theaterList, setTheaterList] = useState<theaterListType>([]);

    // showtimesList
    //  Store all of the showtimes list.
    const [showtimesList, setShowtimesList] = useState<showtimesListType>([]);

    // showtimesMovieList
    //  Store all of the movie that is on showtimes.
    const [showtimesMovieList, setShowtimesMovieList] = useState<moviesListType>([]);

    // useEffect
    //  Try to fetch movies list, theater list, showtimes list, and userInformation from the API. 
    useEffect(() => {
        const fetchMoviesList = async () => {
            try {
                const data = await GetMoviesAPI(); 
                setMoviesList(data.movies);   
            }
            catch (error) {
                console.error(error);
            }
        } 

        const fetchTheatersList = async () => {
            try {
                const data = await GetTheatersAPI();
                setTheaterList(data.theaters);
            }
            catch (error) {
                console.error(error);
            }
        }

        const fetchShowtimesList = async () => {
            try {
                const data = await GetShowtimesAPI();
                setShowtimesList(data.showtimes);
            }
            catch (error) {
                console.error(error);
            }
        }

        const fetchUserInformation = async () => {
            try {
                if (typeof userInformation !== "string") {
                    const data = await GetUserInformationAPI(userInformation.email); 
                    
                    if (data.success) {
                        sessionStorage.setItem("userInformation", JSON.stringify(data.userInformation)); 
                        setUserInformation(data.userInformation);   
                    }   
                }
            }
            catch (error) {
                console.error(error);
            }
        }

        fetchMoviesList();
        fetchTheatersList();
        fetchShowtimesList();
        fetchUserInformation();
    }, [isProcessDone]);


    useEffect(() => {
        // const filteredMovies : moviesListType = moviesList.filter((movie) => {
        //     return (
        //         showtimesList.filter((showtime) => {
        //             console.log(showtime);
        //             return (
        //                 showtime.moviesTitle == movie.title &&
        //                 showtime.moviesDirector == movie.director
        //             )
        //         })
        //     );
        // })
        const filteredMovies: moviesListType = moviesList.filter((movie) => {
            return showtimesList.some((showtime) => {
                return (
                    showtime.moviesTitle === movie.title &&
                    showtime.moviesDirector === movie.director
                );
            });
        });


        setShowtimesMovieList(filteredMovies);      
    }, [moviesList, showtimesList]);


    // isFormActive
    //  Determine is form active or not.
    //  If form is active, the value will be true.
    //  If form is inactive, the value will be false.
    //  This variable will disable any button outside of the form.
    const [isFormActive, setIsFormActive] = useState<boolean>(false);

    // formActiveHandler
    //  Set the value of isFormActive
    const formActiveHandler = (condition : boolean) => {
        setIsFormActive(condition);
    }

    return (
        <AppContext.Provider value = {{
            userInformation, 
            setUserInformationHandler, 
            isProcessDone,
            processDoneHandler,
            moviesList,
            theaterList,
            showtimesList,
            showtimesMovieList,
            isFormActive,
            formActiveHandler
        }}>
            {children}
        </AppContext.Provider>
    );
}

export {AppContext, AppContextProvider}