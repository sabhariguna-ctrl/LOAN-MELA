// import React, { useEffect } from 'react'
// import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
// import Sidebar from '../core/Sidebar'
// import Adminmain from '../core/Adminmain'


// // Scrolls the window to the top whenever the route changes. React Router
// // doesn't do this automatically, so without it, navigating to a new page
// // keeps whatever scroll position the previous page was at.


// export default function Adminrouter() {
//   return (
//     <>
   
  
//      <Routes>
//       <Route element = {<Adminmain/>}>
//       <Route path = "/sidebar" element ={<Sidebar/>}/>
      

//       </Route>

//      </Routes>
     
//     </>
//   )
// }


import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Adminmain from '../core/Adminmain'
import DashboardPage from '../pages/DashboardPage'
import ApplicationsPage from '../pages/ApplicationsPage'
import ApprovedPage from '../pages/ApprovedPage'
import SchemesPage from '../pages/SchemesPage'
import RegisteredUsersPage from '../pages/Registereduserspage'
import BanksPage from '../pages/BanksPage'

// Adminmain already renders Sidebar + Topbar once, globally, around
// whatever the current admin route's Outlet content is. Routes nested
// here should only be actual page content (Dashboard, Applications, etc.)
// — never <Sidebar/> itself, since that would render it a second time
// stacked on top of the one Adminmain already shows.
export default function Adminrouter() {
  return (
    <Routes>
      <Route element={<Adminmain />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/approved" element={<ApprovedPage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/registered-users" element={<RegisteredUsersPage />} />
        <Route path="/banks" element={<BanksPage />} />
        {/* Add the rest as their pages get built, e.g.:
        <Route path="/repayments" element={<Repayments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<SettingsPage />} />
        */}
      </Route>
    </Routes>
  );
}