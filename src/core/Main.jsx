import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function Main() {
  return (
    <>
     <Navbar/>
     <main>
         <Outlet/>
      </main> 
      <Footer/>
    </>
  )
}
