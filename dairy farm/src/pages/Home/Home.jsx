import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreProducts from '../../components/ExploreProducts/ExploreProducts'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'

const Home = () => {
    const[category,setCategory] =useState("All");

    return (
        <div className="home-container">
            <Header/>
            <div className="home-content">
                <ExploreProducts category={category} setCategory={setCategory}/>
                <FoodDisplay category={category} setCategory={setCategory}/>
            </div>
        </div>
    )
}

export default Home
