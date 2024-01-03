import axios from "axios";

import BASE_URL from "../api-base";

const GetShowtimesAPI = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/Showtimes/GetShowtimes`);
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export default GetShowtimesAPI;