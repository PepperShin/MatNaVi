import { createBrowserRouter } from 'react-router-dom'
import TempPage from '../UI/pages/TempPage'
<<<<<<< HEAD
import TripInfoPage from '../UI/pages/TripInfoPage'
=======
import MainLayout from '../UI/layouts/MainLayout'
>>>>>>> main

const routes = [
    {
        path: '/',
<<<<<<< HEAD
        element: <TripInfoPage />
=======
        element: <MainLayout />
>>>>>>> main
    }
]

const router = createBrowserRouter(routes)

export { router, routes }