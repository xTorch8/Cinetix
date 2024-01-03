import axios from "axios";

import BASE_URL from "../api-base";

const GetTicketsUserAPI = async (userEmail : string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/Tickets/GetTicketsUser`, {
            params: {
                Email : userEmail
            }
        });
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export default GetTicketsUserAPI;