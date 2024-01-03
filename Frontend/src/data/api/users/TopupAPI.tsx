import React from "react";
import axios from "axios";

import BASE_URL from "../api-base";

const TopupAPI = async (email : string, amount : number)  => {
    try {
        const response = await axios.put(`${BASE_URL}/api/Users/TopUp`, {
            email   : email,
            amount  : amount,
        });     
        
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export default TopupAPI