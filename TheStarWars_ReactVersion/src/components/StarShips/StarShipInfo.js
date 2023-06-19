import React, { useState } from 'react'
import Button from './button'
import style from './StarShips.module.css'
import PropTypes from 'prop-types';

export default function StarShipInfo({info}) {
  const max_diplay = 6
  const [page, setPage] = useState(1)
  
  return (
    <div className={style.starship_properties_list} >
        <h3>.Starship properties.</h3>
        <h4>{info.name}</h4>

        <ul>
            {
                Object.keys(info).map((key, index) => (
                    page * max_diplay < index && index <= ((page + 1) * max_diplay) ? <li key={index}>
                       {key}: {info[key].toString().includes("http") ? '' : info[key]}
                     </li> : ''
                ))
            }
        </ul>

        <Button id = "pre" name = "Previous" onclick = {setPage}></Button>
        <Button id = "next" name = "Next" onclick = {setPage} itemLen = {info.length}></Button>

    </div>
  )
}

StarShipInfo.prototype = {
  info: PropTypes.array,
  max_diplay: PropTypes.number,
  setPage: PropTypes.func,
  page: PropTypes.number,
}
