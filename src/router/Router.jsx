import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../UI/pages/HomePage';
import RegionalPage from '../UI/pages/RegionalPage';
import DistancePage from '../UI/pages/DistancePage';

const routes = [
{
        path: '/',
        element: <Navigate to="/regional" replace />
  },
    
  {
    path: '/regional',
    element: <RegionalPage />
  },
  {
    path: '/distance',
    element: <DistancePage />
  }
];

const router = createBrowserRouter(routes);

export { router, routes };
