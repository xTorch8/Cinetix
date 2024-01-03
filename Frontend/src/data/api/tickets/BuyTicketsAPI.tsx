import axios from "axios";

import BASE_URL from "../api-base";

const BuyTicketsAPI = async (
    userEmail       : string,
    theaterName     : string,
    movieTitle      : string,
    movieDirector   : string,
    date            : string,
    startTime       : string,
    seatNumber      : number,
) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/Tickets/BuyTicket`, {
            userEmail       : userEmail,
            theaterName     : theaterName,
            movieTitle      : movieTitle,
            movieDirector   : movieDirector,
            date            : date,
            startTime       : startTime,
            seatNumber      : seatNumber,
        });

        return response.data;
    }
    catch (error : unknown) {
        console.log(error);
    }
}

export default BuyTicketsAPI;