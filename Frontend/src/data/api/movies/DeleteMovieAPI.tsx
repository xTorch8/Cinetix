import axios from "axios";

import BASE_URL from "../api-base";

const DeleteMovieAPI = async (userEmail : string, id : number) => {
    try {
        const response = await axios.delete(`${BASE_URL}/api/Movies/DeleteMovie`, {
            data: {
                userEmail   : userEmail,
                id          : id,                
            }   
        });
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export default DeleteMovieAPI;