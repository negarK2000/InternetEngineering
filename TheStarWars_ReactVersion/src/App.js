import React, { useState } from 'react';
import './App.css';
import MovieList from './components/MovieList/MovieList';
import StarShips from './components/StarShips/StarShips';
import image1 from "./images/main_bg.jpg"; 
import image2 from "./images/starships_bg.jpg"; 

export default function App() {
  const [page, setPage] = useState(true);
  const [image, setImage] = useState(image1);
  const [movie, setMovie] = useState("")

  const changePage = () => {
    if (page === true){
      setPage(false)
      setImage(image2)
    } 
    else {
      setPage(true)
      setImage(image1)
    }
  }
  
  return (
    <div className="App">
      <div style = {{ backgroundImage:`url(${image})`}} className="background_image">
        {
          page ? <MovieList setMovie={setMovie} onclick = {changePage}/> : <StarShips movie={movie} onclick = {changePage}/>
        }
      </div>
    </div>
  );
}
