import { createBrowserRouter } from 'react-router-dom'
import TempPage from '../UI/pages/TempPage'
import MainLayout from '../UI/layouts/MainLayout'
import NaverMapPage from '../UI/pages/NaverMapPage'

const routes = [
    {
        path: '/',
        element: <MainLayout />
    },

    {
        path: '/NaverMapPage',
        element: <NaverMapPage />,
        title: '네이버 맵',
    },
]

const router = createBrowserRouter(routes)

export { router, routes }