import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


import { fileURLToPath } from 'url';


import db from './src/config/db.js'

import authRouter from './src/api/auth/auth.routes.js';
import postsRouter from './src/api/posts/posts.routes.js';
import uploadsRouter from './src/api/uploads/uploads.routes.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/login/redirect';
const FRONTEND_REDIRECT_URI = 'http://localhost:5173/auth/google/callback'; // 프론트엔드 콜백 경로


const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// google Auth Logic
app.get('/login', (req, res) => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  // client_id는 위 스크린샷을 보면 발급 받았음을 알 수 있음
  // 단, 스크린샷에 있는 ID가 아닌 당신이 직접 발급 받은 ID를 사용해야 함.
  url += `?client_id=${GOOGLE_CLIENT_ID}`
  // 아까 등록한 redirect_uri
  // 로그인 창에서 계정을 선택하면 구글 서버가 이 redirect_uri로 redirect 시켜줌
  url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`
  // 필수 옵션.
  url += '&response_type=code'
  // 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
  url += '&scope=email profile'
  // 완성된 url로 이동
  // 이 url이 위에서 본 구글 계정을 선택하는 화면임.
  res.redirect(url);
});



// 라우터 연결
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/uploads', uploadsRouter);


app.get('/', (req, res) => {
  res.send('Board API Server is running!');
});

// OAuth 이후 Redirect
app.get('/login/redirect', async (req, res) => {
  const { code } = req.query;

  try {
    // 1. 구글에 액세스 토큰 요청
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
    });

    const { access_token, id_token } = tokenResponse.data; // id_token도 받아옵니다 (사용자 정보가 담겨있을 수 있음)
    // console.log('Google Token Response:', tokenResponse.data); // 디버깅용

    // 2. 구글 사용자 정보 요청 
    let googleUserInfo;
    if (id_token) {
      // id_token은 JWT 형태이므로 직접 디코딩 가능 (서버 측에서는 서명 검증도 하는 것이 좋음)
      // 여기서는 간단히 디코딩만
      const base64Url = id_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
      googleUserInfo = JSON.parse(jsonPayload);
    } else {
      // id_token이 없다면 access_token으로 userinfo API 호출 (덜 권장)
      const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      googleUserInfo = userInfoResponse.data;
    }

    // console.log('Google User Info:', googleUserInfo); // 디버깅용

    const { email, name, id } = googleUserInfo; // 구글 계정의 고유 ID, 이메일, 이름

    const [existingUsers] = await db.query('SELECT * FROM USER WHERE email = ? AND provider = ?', [email, 'google']);
    let user;

    if (existingUsers.length > 0) {
      // 기존 사용자
      user = existingUsers[0];
      console.log('Existing Google user logged in:', user.email);
    } else {
      const userNickname = name || '구글사용자';
      const tempPassword = `google_${id}_${Date.now()}`; // 임의의 값
      const hashedPassword = await bcrypt.hash(tempPassword, 12);

      const [insertResult] = await db.query('INSERT INTO USER (email, password, nickname, provider) VALUES (?, ?, ?, ?)', [
        email,
        hashedPassword, // 임시 비밀번호 또는 null
        userNickname,
        'google', // provider 필드 추가 (DB 스키마에 provider 컬럼이 있어야 함)
      ]);
      const newUserId = insertResult.insertId;
      user = { user_id: newUserId, email, nickname: userNickname, provider: 'google' };
      console.log('New Google user signed up:', user.email);
    }

    // 4. 서비스 JWT 발급
    const serviceToken = jwt.sign(
      { userId: user.user_id, nickname: user.nickname, email: user.email }, // 우리 서비스의 사용자 정보
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 5. 프론트엔드로 리다이렉트 (JWT 포함)
    // 닉네임도 함께 넘겨주면 프론트엔드에서 편리하게 사용 가능
    res.redirect(`${FRONTEND_REDIRECT_URI}?token=${serviceToken}`);

  } catch (error) {
    console.error('Google OAuth Error:', error.response ? error.response.data : error.message);
    // 에러 발생 시 프론트엔드 에러 페이지로 리다이렉트
    res.redirect(`${FRONTEND_REDIRECT_URI}?error=google_oauth_failed`);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend server is running at http://localhost:${PORT}`);
});