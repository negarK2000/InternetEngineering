import React from "react";
import style from './StarShips.module.css'

export default function Button({id, name, onclick, itemLen}){
    const max_diplay = 6

    const buttonClicked = () => {
        if (id === 'home')
            onclick()

        else if (id === 'pre'){
            onclick(preValue => {
                if (preValue - 1 > -1)
                    preValue--

                return preValue
            })

        } else if (id === 'next'){
            const max_page = Math.ceil((itemLen - 1) / max_diplay)

            onclick(preValue => {
                if (preValue + 1 < max_page)
                    preValue++

                return preValue
            })
        }
    }    

    return (
        <button className={style.button} onClick = {buttonClicked}>{name}</button>
    )
}