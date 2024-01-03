import React, {SyntheticEvent} from "react";

interface ButtonProps {
    label       : string,
    type        : "button" | "submit",
    click?      : ((event : SyntheticEvent) => Promise<void>) | (() => void),
    center      : boolean,
    color?      : string,
    hover?      : string,
    disabled    : boolean,
}

const Button = (props : ButtonProps) : JSX.Element => {
    let buttonStyle = "rounded-md drop-shadow-md block my-4 px-2 py-1  ";

    if (props.center === true) {
        buttonStyle = buttonStyle + "mx-auto ";
    }

    if (props.color) {
        buttonStyle = buttonStyle + props.color + " ";
    }
    else {
        buttonStyle = buttonStyle + "bg-sky-200 ";
    }

    if (props.hover) {
        buttonStyle = buttonStyle + props.hover;
    }
    else {
        buttonStyle = buttonStyle + " hover:bg-sky-300 active:bg-sky-300 disabled:bg-slate-200";
    }

    return (
        <button 
            className   = {buttonStyle}
            type        = {props.type} 
            onClick     = {props.click}
            disabled    = {props.disabled}
        >
            {props.label}
        </button>
    )
}

export default Button