import { createBrowserRouter } from 'react-router-dom'
import TempPage from '../UI/pages/TempPage'
import MainLayout from '../UI/layouts/MainLayout'

const routes = [
    {
        path: '/',
        element: <MainLayout />
    }
]

const router = createBrowserRouter(routes)

export { router, routes }