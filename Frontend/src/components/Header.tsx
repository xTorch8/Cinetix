import React, { useContext} from "react";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../context/app-context";

const Header  = () : JSX.Element => {
    const navigate = useNavigate();

    // appContext
    //  Use app-context.tsx and retrieve userInformation, setUserInformationHandler, and isFormActive.
    const appContext = useContext(AppContext);
    const {userInformation, setUserInformationHandler, isFormActive} = appContext;
    
    // logoutHandler
    const logoutHandler = () => {
        sessionStorage.removeItem("userInformation");
        setUserInformationHandler("");
        navigate("/");
    }

    return (
        <header className = "bg-sky-100 p-4 drop-shadow-md flex top-0 sticky z-10">
            <section className = "w-1/4">
                <h1 
                    className = "text-xl font-bold cursor-pointer" 
                    onClick = {() => {navigate("/")}}
                > 
                    Cinetix 
                </h1>    
            </section>
            
            <nav className = "w-3/4">
                <ul className = "flex float-right">
                    {
                        typeof userInformation !== "string" 
                            ?
                                <>
                                    {
                                        userInformation.isAdmin 
                                        ?
                                            <li className = "mx-2">
                                                <button 
                                                    className   = "hover:text-red-600 disabled:text-black"
                                                    onClick     = {() => navigate("/admin")}
                                                    disabled    = {isFormActive}
                                                > 
                                                    Admin 
                                                </button>
                                            </li>
                                        :
                                            <li className = "mx-2">
                                                <button 
                                                    className   = "hover:text-red-600 disabled:text-black"
                                                    onClick     = {() => navigate("/profile")}
                                                    disabled    = {isFormActive}
                                                > 
                                                    Profile 
                                            </button>
                                            </li>
                                    }

                                    <li className = "mx-2">
                                        <button 
                                            className   = "hover:text-red-600 disabled:text-black"
                                            onClick     = {logoutHandler}
                                            disabled    = {isFormActive}
                                        > 
                                            Logout 
                                        </button>
                                    </li> 
                                </>
                            :
                                <>
                                    <li className="mx-2">
                                        <button 
                                            className   = "hover:text-red-600"
                                            onClick     =  {() => navigate("/login")}
                                            disabled    = {isFormActive}
                                        > 
                                            Login 
                                        </button>
                                    </li>

                                    <li className="mx-2">
                                        <button 
                                            className   = "hover:text-red-600"
                                            onClick     = {() => navigate("/register")}
                                            disabled    = {isFormActive}
                                        > 
                                            Register 
                                        </button>
                                    </li>
                                </>
                    }
                </ul>
            </nav>
        </header>
    );
}

export default Header;