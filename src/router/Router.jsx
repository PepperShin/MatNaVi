import { createBrowserRouter } from 'react-router-dom'
import TempPage from '../UI/pages/TempPage'
import TripInfoPage from '../UI/pages/TripInfoPage'

const routes = [
    {
        path: '/',
        element: <TripInfoPage />
    }
]

const router = createBrowserRouter(routes)

export { router, routes }