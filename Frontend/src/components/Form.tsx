import React, { ReactNode, FormEvent } from "react";

interface FormProps {
    submit      : (() => void) | ((event: FormEvent<HTMLFormElement>) => Promise<void>),
    children    : ReactNode,
    width?      : String,
}

const Form = (props : FormProps) : JSX.Element => {
    return (
        <form className = "bg-sky-100 w-4/5 lg:w-2/5 mx-auto rounded-md drop-shadow-md p-4 my-8" onSubmit = {props.submit}>
            {props.children}
        </form>
    )
}

export default Form;