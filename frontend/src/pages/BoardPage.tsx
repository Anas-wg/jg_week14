import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PostCard from "../components/common/PostCard";
import Pagination from "../components/common/Pagination";
import Button from "../components/common/Button";
import { getPosts } from "../api/posts";
import { type Post } from "../types/post";

const BoardPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  console.log("URL에서 읽어온 현재 페이지:", currentPage);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts(currentPage);
        setPosts(data.posts);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("게시글 로딩 실패", error);
      }
    };
    fetchPosts();
  }, [currentPage]); // currentPage가 바뀔 때마다 API를 다시 호출

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl">Posts</h1>
        <a
          className="text-primary-blue underline flex justify-center items-center"
          onClick={() => navigate("/posts/new")}
        >
          글쓰기
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </a>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.post_id} post={post} />
        ))}
      </div>

      <div className="mt-12">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default BoardPage;
