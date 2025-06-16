import { createBrowserRouter, RouterProvider } from "react-router";
import MainPage from "../pages/MainPage";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import BoardPage from "../pages/BoardPage";
import DefaultLayout from "./layouts/Default";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/posts",
        element: <BoardPage />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
