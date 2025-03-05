import { createBrowserRouter } from 'react-router-dom'
import TempPage from '../UI/pages/TempPage'

const routes = [
    {
        path: '/',
        element: <TempPage />
    }
]

const router = createBrowserRouter(routes)

export { router, routes }