import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import React, { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Login/>}>
        <Route index element={<Login/>}/>
        <Route path = "Home" element={<Home/>}/>
        <Route path = "Login" element={<Login/>}/>
        <Route path = "Register" element={<Register/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  );
}


export default App;
