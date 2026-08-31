import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Main from '../core/Main'
import Homepage from '../pages/Homepage'
import Aboutpage from '../pages/Aboutpage'
import Loanschema from '../pages/Loanschema'
import HowItWorks from '../pages/HowItWorks'
import Register from '../pages/Register'
import Login from '../pages/Login'

// Scrolls the window to the top whenever the route changes. React Router
// doesn't do this automatically, so without it, navigating to a new page
// keeps whatever scroll position the previous page was at.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function Approuter() {
  return (
    <>
     <BrowserRouter>
     <ScrollToTop/>
     <Routes>
      <Route element = {<Main/>}>
      <Route path = "/"element ={<Homepage/>}/>
      <Route path="/about-us" element ={<Aboutpage/>}/>
      <Route path="/schema" element ={<Loanschema/>}/>
      <Route path="/how-it-works" element ={<HowItWorks/>}/>
      <Route path="/register" element ={<Register/>}/>
      <Route path="/login" element ={<Login/>}/>

      </Route>

     </Routes>
      </BrowserRouter> 
    </>
  )
}