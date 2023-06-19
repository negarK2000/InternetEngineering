import React, { useState, useEffect} from 'react'
import Button from './button'
import StarShipInfo from './StarShipInfo'
import style from './StarShips.module.css'
import PropTypes from 'prop-types';

export default function StarShips({movie, onclick}) {
    const [starship, setStarship] = useState(" ")
    const [starships, setStarships] = useState([])
    const [isLoading, setLoading] = useState(true)

    const getStarshipInfo = (e, ship) => setStarship(ship)

    const addStarships = (links) =>{
        setStarships([])
        
        for(let i = 0 ; i < links.length ; i++){

            fetch(links[i])
            .then(response => response.json())
            .then(newShip => {
                setStarships (preList => {

                    for (let j = 0 ; j < preList.length ; j++){
                        if(preList[j].name == newShip.name)
                        return preList
                    }
                    
                    return [...preList, newShip]
                })
            })
        }

        setLoading(false)
    }

    const movie_url = `https://swapi.dev/api/films/`

    useEffect(() => {

        fetch(movie_url + movie)
        .then(response => response.json())
        .then(data => {
            addStarships(data['starships'])
        })
       
    },[])

    return (
        <div className={style.main_content}>

            <nav className={style.starships_list}>
                <header className={style.page_title}>«Starships»</header>

                <ul>
                    {
                        isLoading ? "Loading..." : starships.map((ship) => (
                            <li key={ship.name} onClick={event => getStarshipInfo(event, ship)}>{ship.name}</li>
                        ))
                    }
                </ul>

                <Button id = "home" name = "Home" onclick = {onclick}></Button>
            </nav>

            <StarShipInfo info={starship}></StarShipInfo>
        </div>
    )
}

StarShips.prototype = {
    movie: PropTypes.string,
    onclick: PropTypes.func,
    starship: PropTypes.string,
    starships: PropTypes.array,
    isLoading: PropTypes.bool,
    movie_url: PropTypes.string,
    ship: PropTypes.bool,
    links:PropTypes.array,
    setStarship: PropTypes.func,
    setStarships: PropTypes.func,
    setLoading: PropTypes.func,
    getStarshipInfo: PropTypes.func,
    addStarships: PropTypes.func,
}
