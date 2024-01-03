import axios from "axios";

import BASE_URL from "../api-base";

const EditShowtimesAPI = async (
    id              : number,
    userEmail       : string,
    movieTitle      : string,
    movieDirector   : string,
    theaterName     : string,
    date            : string,
    startTime       : string,
    ticketPrice     : number,
) => {
    try {
        const formattedStartTime = startTime;
        console.log(formattedStartTime);
        const response = await axios.put(`${BASE_URL}/api/Showtimes/EditShowtimes`, {
            id              : id,
            userEmail       : userEmail,
            movieTitle      : movieTitle,
            movieDirector   : movieDirector,
            theaterName     : theaterName,
            date            : new Date(date).toISOString(),
            startTime       : formattedStartTime,
            ticketPrice     : ticketPrice,
        });

        return response.data;
    }
    catch (error : unknown) {
        console.log(error);
    }
}

export default EditShowtimesAPI;