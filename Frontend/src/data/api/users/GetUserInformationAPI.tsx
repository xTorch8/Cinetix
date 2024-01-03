import axios from "axios";

import BASE_URL from "../api-base";

const GetUserInformationAPI = async (email : string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/Users/GetUserInformation`, {
            params: {
                email: email,
            }
        });
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export default GetUserInformationAPI;