import React, { useState, useEffect} from 'react'
import Button from './button'
import style from './MovieList.module.css'
import PropTypes from 'prop-types';

export default function MovieList({setMovie, onclick}) {
  const [movies, setmovies] = useState([])
  const [isLoading, setLoading] = useState(true)
  const movie_ids = {4:1, 5:2, 6:3, 1:4, 2:5, 3:6}

  const addMovie = (newMovie) =>{
    setmovies (preList => {

      for (let i = 0 ; i < preList.length ; i++){
        if(preList[i].episode_id == newMovie.episode_id)
          return preList
      }

      if (preList.length == 5)
        setLoading(false)
      
      return [...preList, newMovie]
    })
  }

  const movie_url = `https://swapi.dev/api/films/`

  useEffect(() => {
    setmovies([])

    for(let i = 1 ; i < 7 ; i++){
      fetch(movie_url + i)
      .then(response => response.json())
      .then(data => {addMovie(data)})
    }
    
  },[])

  return (
    <div className={style.main_content}>
      <nav className={style.movie_list}>
          <header className={style.page_title}>
              ... Star Wars Movies ...
          </header>

          <ul>
              {
                isLoading ? "Loading..." : movies.map((movie) => (
                  <li key={movie.episode_id}>
                    Star Wars: {movie.title} - EPISODE {movie.episode_id} - {movie.release_date}
                    <Button key={movie.episode_id} id={movie_ids[movie.episode_id]} setMovie={setMovie} name = "Starships" onclick = {onclick}></Button>
                  </li>
                ))
              }
          </ul>
          
      </nav>
    </div>
  )
}

MovieList.prototype = {
  setMovie: PropTypes.func,
  onclick: PropTypes.func,
  setmovies: PropTypes.func,
  setLoading: PropTypes.func,
  movie_url: PropTypes.string,
  movies: PropTypes.array,
  addMovie: PropTypes.func,
  movie_ids: PropTypes.object,
  newMovie: PropTypes.object,
}