import React from "react";
import { type Post } from "../../types/post";
import PostCard from "../common/PostCard";

interface LatestPostsSectionProps {
  posts: Post[];
}

// Props API 로직으로부터 받은 게시글 목록
const LatestPostsSection: React.FC<LatestPostsSectionProps> = ({ posts }) => {
  return (
    <div className="w-full max-w-4xl">
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.post_id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default LatestPostsSection;
