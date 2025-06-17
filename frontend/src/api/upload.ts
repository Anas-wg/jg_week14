import apiClient from "./client";

export const uploadImage = async (
  imageFile: File
): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append("image", imageFile); // 'image'는 백엔드 multer에서 설정한 key와 일치해야 함

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
