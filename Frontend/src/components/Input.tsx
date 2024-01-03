import React, {ChangeEventHandler} from "react";

interface InputProps {
    label       : string,
    inputType   : "text" | "email" | "date" | "password" | "url" | "time" | "number",
    change      : ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    placeholder : string,
    required    : boolean,
    long?       : boolean,
    value?      : string | number,
}

const Input = (props : InputProps) : JSX.Element => {
    return (
        <section className = "flex w-full flex-col lg:flex-row justify-center items-center mt-4 ">
            <section className = "w-full lg:w-[30%]">
                <h1 className = "lg:text-right lg:mx-4"> {props.required ? <span className = "text-red-600 font-bold"> * </span> : <></>} {props.label}  </h1>
            </section>

            <section className = "w-full lg:w-[70%]">
                {
                    props.long === true
                    ?
                        <textarea 
                            className   = "w-full"
                            style       = {{"resize": "none"}} 
                            onChange    = {props.change}
                            value       = {props.value}
                            required    = {props.required}
                        />

                    :
                        <input
                            className   = {"w-full"}
                            type        = {props.inputType}
                            onChange    = {props.change}
                            placeholder = {props.placeholder}
                            value       = {props.value}
                            required    = {props.required}
                        />                
                }

            </section>
        </section>
    );
}

export default Input;