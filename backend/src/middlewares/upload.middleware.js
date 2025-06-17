import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ES 모듈에서 __dirname을 사용하기 위한 표준 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 목적지 폴더의 절대 경로를 계산합니다.
// 현재 파일 위치(__dirname)에서 두 단계 위로 올라가(../../) 'uploads' 폴더를 가리킵니다.
// 즉, backend/uploads/ 폴더를 정확히 가리키게 됩니다.
const uploadsDir = path.join(__dirname, '../../uploads');

// 2. 서버 시작 시 uploads 폴더가 없으면 자동으로 생성합니다.
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 디스크 저장소 엔진 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 3. 문자열 대신 계산된 절대 경로 변수를 사용합니다.
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// multer 인스턴스 생성
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB 파일 크기 제한
});

export default upload;