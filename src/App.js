import { BrowserRouter } from "react-router-dom";

import './App.scss'
import Router from "./router/index";
import histrory from "./router/histrory";
import Toast from "./components/toast/Toast";
import "./assets/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css"; 
import 'moment/locale/ru'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { sync } from "./store/asyncAction/auth";

function App() {
  const dispatch = useDispatch()
  useEffect(()=>{
    console.log('sync')
    dispatch(sync())
  }, [])
  return (
    <>
      <Toast/>
      <Router />
    </>


  );
}

export default App;
