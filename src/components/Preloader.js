import React from 'react'
import ReactLoading from 'react-loading'
//import PreloaderImg from '../images/preloader-screenshot.png'

const Preloader = () => (
    <div className="App">
        <ReactLoading type={"bars"} color={"#000000"} />
        <h2>Loading Dope Viz</h2>
    </div>

) 

export default Preloader