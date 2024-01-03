import axios, { AxiosError } from "axios";

import BASE_URL from "../api-base";

const EditMovieAPI = async (
    id              : number,
    userEmail       : string,
    title           : string,
    genre           : string,
    releaseDate     : string,
    director        : string,
    durationHours   : string,
    durationMinutes : string,
    durationSeconds : string,    
    description     : string,
    poster          : string,
    trailer         : string,
) => {
    try {
        // duration
        //  Make "hh:mm:ss" format.
        const duration : string =
            (
                (
                    String(durationHours).length === 1 
                        ? "0" + String(durationHours) 
                        : String(durationHours)
                ) + ":" +
                (
                    String(durationMinutes).length === 1 
                        ? "0" + String(durationMinutes) 
                        : String(durationMinutes)
                ) + ":" +
                (
                    String(durationSeconds).length === 1 
                        ? "0" + String(durationSeconds) 
                        : String(durationSeconds)
                )              
            ); 
        
        const response = await axios.put(`${BASE_URL}/api/Movies/EditMovie`, {
            id          : id,
            userEmail   : userEmail,
            title       : title,
            genre       : genre,
            releaseDate : new Date(releaseDate).toISOString(),
            director    : director,
            duration    : duration,
            description : description,
            poster      : poster,
            trailer     : trailer,
        });
        return response.data;
    }
    catch (error : unknown) {
        console.log(error);
    }
}

export default EditMovieAPI;