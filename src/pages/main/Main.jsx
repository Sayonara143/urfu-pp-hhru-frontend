import React from 'react'
import classes from './Main.module.scss'
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';


const Main = () => {
  const navigate = useNavigate(); // Хук для навигации
  return (
    <div className={classes.container}>

      <div className={classes.wrapper}>
        <h1>Работа найдётся для каждого</h1>
        <div><Button style={{'marginTop': '20px' }} label="Войти"    onClick={() => navigate('/login')} /></div>
      </div>
    </div>
  )
}

export default Main