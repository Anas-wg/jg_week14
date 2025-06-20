import React, { useEffect, useState } from "react";
import MainBanner from "../components/Main/MainBanner";
import LatestPostsSection from "../components/Main/LatestPostsSection";
import type { Post } from "../types/post";
import { getLatestPosts } from "../api/posts";

const MainPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  // useEffect 훅 통해서 렌더링 완료시 1회만 최근 게시물 데이터 fetch
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const latestPosts = await getLatestPosts(); // (API 함수)
        setPosts(latestPosts);
      } catch (error) {
        console.error("게시글을 불러오는 데 실패했습니다:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto my-16 flex flex-col items-center justify-center gap-16">
      <MainBanner />
      <div className="w-full flex justify-between items-center py-4 px-4">
        <h2 className="text-xl text-black font-['Brown']">Latest Posts</h2>
      </div>
      <LatestPostsSection posts={posts} />
    </div>
  );
};

export default MainPage;
