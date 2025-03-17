import { createBrowserRouter, Navigate } from 'react-router-dom';
import DistancePage from '../UI/pages/DistancePage';

const routes = [
{
        path: '/',
        element: <Navigate to="/regional" replace />
  },
    
  {
    path: '/distance',
    element: <DistancePage />
  }
];

const router = createBrowserRouter(routes);

export { router, routes };
