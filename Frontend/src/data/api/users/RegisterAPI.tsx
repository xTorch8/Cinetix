import axios from "axios";

import BASE_URL from "../api-base";

const RegisterAPI = async (firstName : string, lastName : string | undefined, email : string, password : string, confirmPassword : string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/Users/Register`, {
            firstName       : firstName,
            lastName        : lastName,
            email           : email,
            password        : password,
            confirmPassword : confirmPassword,
        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export default RegisterAPI;