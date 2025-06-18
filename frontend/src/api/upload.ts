import apiClient from "./client";

// 이미지 표출위한 API 호출 함수
export const uploadImage = async (
  imageFile: File
): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await apiClient.post("/uploads/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("이미지 업로드에 실패했습니다:", error);
    throw error;
  }
};
