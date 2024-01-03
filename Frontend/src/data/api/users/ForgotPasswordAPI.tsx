import axios from "axios";

import BASE_URL from "../api-base";

const ForgotPasswordAPI = async (email : string, password : string, confirmPassword : string) => {
    try {
        const response = await axios.put(`${BASE_URL}/api/Users/ForgotPassword`, {
            email           : email,
            password        : password,
            confirmPassword : confirmPassword
        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export default ForgotPasswordAPI;