import axios from "axios";

import BASE_URL from "../api-base";

const GetMoviesAPI = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/Movies/GetMovies`);
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export default GetMoviesAPI;