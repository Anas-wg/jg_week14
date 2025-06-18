// PostCard 정보
export interface Post {
  post_id: number;
  title: string;
  content: string;
  author: {
    id: number;
    nickname: string;
  };
  created_at: string;
  imageUrl?: string; // 게시글에서 parsing한 이미지 태그
}

// 게시글 상세 정보 타입
export interface PostDetail {
  post_id: number;
  title: string;
  content: string; // HTML 형식의 본문
  created_at: string;
  view_count: number;
  author: {
    id: number;
    nickname: string;
  };
  comments: Comment[]; // 댓글 목록
}

export interface Comment {
  comment_id: number;
  post_id: number;
  author_id: number;
  content: string;
  created_at: string;
  parent_comment_id: number | null;

  // 댓글 작성자
  author_nickname: string;

  // 대댓글 리스트
  replies: Comment[];
}
