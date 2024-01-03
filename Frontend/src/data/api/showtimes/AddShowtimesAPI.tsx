import axios from "axios";

import BASE_URL from "../api-base";

const AddShowtimesAPI = async (
    userEmail       : string,
    movieTitle      : string,
    movieDirector   : string,
    theaterName     : string,
    date            : string,
    startTime       : string,
    ticketPrice     : number,
) => {
    try {
        const formattedStartTime = startTime + ":00";

        const response = await axios.post(`${BASE_URL}/api/Showtimes/AddShowtimes`, {
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

export default AddShowtimesAPI;