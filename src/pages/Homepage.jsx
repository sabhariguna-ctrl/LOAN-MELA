import React from 'react'
import Herosection from '../shared/components/home/Herosection'
import Aboutsection from '../shared/components/home/Aboutsection'
import LoanSchemesSection from '../shared/components/home/LoanSchemesSection'
import HowItWorksSection from '../shared/components/home/HowItWorksSection'

export default function Homepage() {
  return (
    <>
      <Herosection/>
      <Aboutsection/>
      <LoanSchemesSection/>
      <HowItWorksSection/>
    </>
  )
}
