import React from 'react'
import Header from '../components/common/Header'
import TripInfoPage from '../pages/TripInfoPage'

const MainLayout = () => {
  return (
    <div className='vh-100 d-flex flex-column justify-content-start'>
      <Header/>
      <TripInfoPage/>
    </div>
  )
}

export default MainLayout