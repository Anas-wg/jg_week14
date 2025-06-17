export interface Post {
  post_id: number;
  title: string;
  content: string;
  author: {
    nickname: string;
  };
  created_at: string;
  imageUrl?: string; // 게시글에 연관된 이미지 URL (선택적)
}
