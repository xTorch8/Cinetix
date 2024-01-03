import axios from "axios";

import BASE_URL from "../api-base";

const LoginAPI = async (email : string, password : string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/Users/Login`, {
            email       : email,
            password    : password
        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export default LoginAPI;