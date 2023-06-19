import React from "react";
import style from "./MovieList.module.css"

export default function Button({id ,setMovie, name, onclick}){

    const buttonClicked = () => {
        onclick()
        setMovie(id)
    }

    return (
        <button className={style.button} onClick={buttonClicked}>{name}</button>
    )
}