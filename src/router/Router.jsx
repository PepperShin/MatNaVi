// src/Router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainPage from "../UI/pages/MainPage";
import RegionalPage from "../UI/pages/RegionalPage";
import DistancePage from "../UI/pages/DistancePage";

const routes = [
  {
    path: "/",
    element: <MainPage />,
  },
  {
    // 팀원 코드에서는 RegionalPage에서 useParams()로 province와 city를 읽습니다.
    path: "/regional/:province/:city",
    element: <RegionalPage />,
  },
  {
    path: "/distance",
    element: <DistancePage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

const router = createBrowserRouter(routes);
export { router, routes };
