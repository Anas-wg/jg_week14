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
        // 메인 페이지
        path: "/",
        element: <MainPage />,
      },
      {
        // 게시글 목록
        path: "/posts",
        element: <BoardPage />,
      },
      {
        // 글쓰기 페이지
        path: "/posts/new",
        element: (
          <ProtectedRoute>
            <WritePage />
          </ProtectedRoute>
        ),
      },
      // 게시물 상세
      {
        path: "/posts/:postId",
        element: <PostDetailPage />,
      },
      {
        // 수정
        path: "/write",
        element: <WritePage />,
      },
    ],
  },
  {
    // 로그인
    path: "/signin",
    element: <SignIn />,
  },
  {
    // 회원가입
    path: "/signup",
    element: <SignUp />,
  },
  {
    // Google OAuth
    path: "/auth/google/callback",
    element: <GoogleCallback />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
