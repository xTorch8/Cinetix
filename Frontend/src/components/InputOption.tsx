import React, {ChangeEvent} from "react";

interface InputOptionProps {
    required    : boolean,
    label       : string,
    list        : any[],
    element     : string,
    change      : (event : ChangeEvent<HTMLSelectElement>) => void,
    value?      : string,
}

const InputOption = (props : InputOptionProps) : JSX.Element => {
    return (
        <section className = "flex w-full flex-col lg:flex-row justify-center items-center mt-4 ">
            <section className = "w-full lg:w-[30%]">
                <h1 className = "lg:text-right lg:mx-4">{props.required ? <span className = "text-red-600 font-bold"> * </span> : <></>} {props.label} </h1>
            </section>
            <section className = "w-full lg:w-[70%]">
                <select className = "w-full" onChange = {props.change} value = {props.value}>
                    {props.list.map((item, index) => {
                        return (
                            <option value = {item[props.element]} key = {index}> 
                                {item[props.element]} 
                            </option>
                        )
                    })}
                </select>
            </section>
        </section>       
    );
}

export default InputOption;