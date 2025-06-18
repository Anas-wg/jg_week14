import { createBrowserRouter, RouterProvider } from "react-router";
import MainPage from "../pages/MainPage";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import BoardPage from "../pages/BoardPage";
import DefaultLayout from "./layouts/Default";
import WritePage from "../pages/WritePage";
import PostDetailPage from "../pages/PostDetailPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import GoogleCallback from "../components/auth/GoogleCallback";

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        // 게시글 목록
        path: "/posts",
        element: <BoardPage />,
      },
      {
        path: "/posts/new",
        element: (
          <ProtectedRoute>
            <WritePage />
          </ProtectedRoute>
        ),
      },
      { path: "/posts/:postId", element: <PostDetailPage /> },
      { path: "/write", element: <WritePage /> },
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
  {
    path: "/auth/google/callback",
    element: <GoogleCallback />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
