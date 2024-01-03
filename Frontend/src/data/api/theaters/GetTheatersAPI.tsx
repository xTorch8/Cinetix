import axios from "axios";

import BASE_URL from "../api-base";

const GetTheatersAPI = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/Theaters/GetTheaters`);
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export default GetTheatersAPI;