export interface Post {
  post_id: number;
  title: string;
  content: string;
  author: {
    id: number;
    nickname: string;
  };
  created_at: string;
  imageUrl?: string; // 게시글에 연관된 이미지 URL (선택적)
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
  comments: Comment[]; // 댓글 목록 포함
}

export interface Comment {
  comment_id: number;
  post_id: number;
  author_id: number;
  content: string;
  created_at: string;
  parent_comment_id: number | null; // 1. 오타 수정 및 null 허용

  // 2. API가 JOIN을 통해 보내주는 추가 정보
  author_nickname: string;

  // 3. 컨트롤러에서 계층 구조로 만들 때 추가되는 정보
  replies: Comment[];
}
