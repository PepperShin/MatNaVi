import React from 'react'
import Header from '../components/common/Header'
import {Outlet} from 'react-router-dom'


const MainLayout = () => {
  return (
      
      <div className='vh-100 d-flex flex-column justify-content-between'>
      <Header/>
      <Outlet/>
      
    </div>
  )
}

export default MainLayout