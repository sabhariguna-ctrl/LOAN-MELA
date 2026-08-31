import React from 'react'
import Herosection from '../shared/components/home/Herosection'
import Howitworkssection from '../shared/components/home/Howitworkssection'
import Testimonals from '../shared/components/home/Testimonals'
import Contactsection from '../shared/components/home/Contactsection'
import SchemesSection from '../shared/components/home/Schemesection'


export default function Homepage() {
  return (
    <>
    
     <Herosection/> 
     <SchemesSection/>
     <Howitworkssection/>
     <Testimonals/>
     <Contactsection/>
    </>
  )
}
