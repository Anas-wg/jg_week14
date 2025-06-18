import apiClient from "./client";
import { type Post, type PostDetail } from "../types/post"; // Post 타입 import

// 최신 게시글 2개를 가져오는 API 함수
export const getLatestPosts = async (): Promise<Post[]> => {
  try {
    const response = await apiClient.get("/posts/latest");
    return response.data;
  } catch (error) {
    console.error("최신 게시글을 불러오는 데 실패했습니다:", error);
    throw error; // 에러를 다시 throw하여 호출한 쪽에서 처리할 수 있게 함
  }
};

// Pagination
export interface PaginatedPosts {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
  };
}

// 페이지 번호를 받아 해당 페이지의 게시글 목록을 가져오는 함수
export const getPosts = async (page: number): Promise<PaginatedPosts> => {
  try {
    const response = await apiClient.get(`/posts?page=${page}&limit=10`);
    return response.data;
  } catch (error) {
    console.error("게시글 목록을 불러오는 데 실패했습니다:", error);
    throw error;
  }
};

interface CreatePostData {
  title: string;
  content: string;
}

// 새 게시글을 생성하는 API 함수
export const createPost = async (postData: CreatePostData): Promise<Post> => {
  try {
    const response = await apiClient.post("/posts", postData);
    return response.data;
  } catch (error) {
    console.error("게시글 생성에 실패했습니다:", error);
    throw error;
  }
};

// 특정 ID의 게시글 상세 정보를 가져오는 함수
export const getPostById = async (postId: string): Promise<PostDetail> => {
  try {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`게시글(id: ${postId})을 불러오는 데 실패했습니다:`, error);
    throw error;
  }
};

export const updatePost = async (
  postId: number,
  postData: { title: string; content: string }
): Promise<Post> => {
  try {
    if (!postId || isNaN(postId)) {
      throw new Error('유효하지 않은 게시글 ID입니다.');
    }
    if (!postData.title.trim() || !postData.content.trim()) {
      throw new Error('제목과 내용은 필수 입력사항입니다.');
    }
    const response = await apiClient.put(`/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error(`게시글(id: ${postId}) 수정에 실패했습니다:`, error);
    throw error;
  }
};

export const deletePost = async (postId: number) => {
  const response = await apiClient.delete(`/posts/${postId}`);
  return response.data;
};
