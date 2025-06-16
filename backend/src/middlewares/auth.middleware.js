import jwt from 'jsonwebtoken';
import 'dotenv/config'; // process.env 변수를 사용하기 위해 추가

// exports.verifyToken = ... 구문을 export const verifyToken = ... 으로 변경
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer " 부분 제거
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // req 객체에 사용자 정보 저장
    next(); // 다음 미들웨어 또는 컨트롤러로 진행
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(419).json({ error: '토큰이 만료되었습니다.' });
    }
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
};