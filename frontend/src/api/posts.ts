import apiClient from "./client";
import { type Post } from "../types/post"; // Post 타입 import

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
