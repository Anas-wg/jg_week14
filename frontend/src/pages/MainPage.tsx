import React, { useEffect, useState } from "react";
import MainBanner from "../components/Main/MainBanner";
import LatestPostsSection from "../components/Main/LatestPostsSection";
import type { Post } from "../types/post";
import { getLatestPosts } from "../api/posts";

const MainPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // 페이지가 로드될 때 최신 게시글을 불러오는 API를 호출합니다.
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
