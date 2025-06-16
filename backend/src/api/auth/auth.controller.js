import db from '../../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const { email, password, nickname } = req.body;

  try {
    const [exUser] = await db.query('SELECT * FROM USER WHERE email = ?', [email]);
    if (exUser.length) {
      return res.status(409).json({ error: '이미 사용 중인 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.query('INSERT INTO USER (email, password, nickname) VALUES (?, ?, ?)', [
      email,
      hashedPassword,
      nickname,
    ]);

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.query('SELECT * FROM USER WHERE email = ?', [email]);
    if (!user.length) {
      return res.status(401).json({ error: '존재하지 않는 이메일입니다.' });
    }

    const result = await bcrypt.compare(password, user[0].password);
    if (!result) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    const token = jwt.sign(
      { userId: user[0].user_id, nickname: user[0].nickname },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 응답 객체에 user 정보를 추가합니다.
    const responseUser = {
      userId: user[0].user_id,
      nickname: user[0].nickname,
      email: user[0].email
    };

    res.status(200).json({
      message: '로그인 성공',
      accessToken: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};