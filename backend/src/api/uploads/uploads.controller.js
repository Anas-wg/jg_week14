export const uploadImage = (req, res) => {
  // upload.single() 미들웨어가 파일 처리를 완료하고 req.file 객체에 정보를 담아줍니다.
  if (!req.file) {
    return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
  }

  // 클라이언트에게 파일이 저장된 URL을 응답합니다.
  // 예: http://localhost:3000/uploads/image-1678886400000.png
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(200).json({
    message: '이미지 업로드 성공',
    imageUrl: imageUrl,
  });
};