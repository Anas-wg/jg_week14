import db from '../../config/db.js';

// 'exports.getPosts ='를 'export const getPosts ='으로 변경합니다.
export const getPosts = async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT p.post_id, p.title, p.created_at, u.nickname as author
      FROM POST p
      JOIN USER u ON p.author_id = u.user_id
      ORDER BY p.created_at DESC
    `);
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
};

// 'exports.createPost ='를 'export const createPost ='으로 변경합니다.
export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const { userId } = req.user;

  try {
    const [result] = await db.query(
      'INSERT INTO POST (title, content, author_id) VALUES (?, ?, ?)',
      [title, content, userId]
    );

    const createdPostId = result.insertId;
    const [newPost] = await db.query('SELECT * FROM POST WHERE post_id = ?', [createdPostId]);

    res.status(201).json(newPost[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
};

// 'exports.getPostById ='를 'export const getPostById ='으로 변경합니다.
export const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    // 1. 게시글 정보와 작성자 정보를 함께 가져옵니다.
    const [postResult] = await db.query(`
      SELECT p.*, u.nickname as author_nickname 
      FROM POST p
      JOIN USER u ON p.author_id = u.user_id
      WHERE p.post_id = ?
    `, [postId]);

    if (!postResult.length) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }

    const post = postResult[0];

    // 2. 해당 게시글의 모든 댓글들을 작성자 정보와 함께 가져옵니다. (작성일 순으로)
    const [commentsResult] = await db.query(`
      SELECT c.*, u.nickname as author_nickname
      FROM COMMENT c
      JOIN USER u ON c.author_id = u.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [postId]);

    // 3. 댓글 목록을 계층 구조로 변환하는 로직 (대댓글 처리)
    const commentsMap = new Map();
    const rootComments = [];

    commentsResult.forEach(comment => {
      // 각 댓글에 replies 배열을 초기화합니다.
      comment.replies = [];
      commentsMap.set(comment.comment_id, comment);
    });

    commentsResult.forEach(comment => {
      if (comment.parent_comment_id) {
        // 이 댓글이 대댓글이라면, 부모 댓글의 replies 배열에 추가합니다.
        const parentComment = commentsMap.get(comment.parent_comment_id);
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      } else {
        // 이 댓글이 최상위 댓글이라면, rootComments 배열에 추가합니다.
        rootComments.push(comment);
      }
    });

    // 4. 최종적으로 게시글 정보와 계층화된 댓글 목록을 함께 응답합니다.
    res.status(200).json({
      ...post,
      comments: rootComments,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};


export const createComment = async (req, res) => {
  const { postId } = req.params; // URL에서 postId를 가져옵니다.
  const { content, parent_comment_id = null } = req.body; // Body에서 content와 parent_comment_id를 가져옵니다.
  const { userId } = req.user; // 인증 미들웨어에서 사용자 ID를 가져옵니다.

  try {
    // 댓글을 DB에 추가합니다.
    const [result] = await db.query(
      'INSERT INTO COMMENT (post_id, author_id, content, parent_comment_id) VALUES (?, ?, ?, ?)',
      [postId, userId, content, parent_comment_id]
    );

    const createdCommentId = result.insertId;

    // 방금 생성된 댓글 정보를 다시 조회해서 클라이언트에게 보내줍니다.
    const [newComment] = await db.query('SELECT * FROM COMMENT WHERE comment_id = ?', [
      createdCommentId,
    ]);

    res.status(201).json(newComment[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};