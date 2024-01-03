import axios from "axios";

import BASE_URL from "../api-base";

const GetTicketsShowtimeAPI = async (id : number) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/Tickets/GetTicketsShowtime`, {
            params: {
                showtimeId : id,
            }
        });

        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export default GetTicketsShowtimeAPI;