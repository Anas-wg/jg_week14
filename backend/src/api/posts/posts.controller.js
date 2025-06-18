import db from '../../config/db.js';

// Pagination 잆이
// export const getPosts = async (req, res) => {
//   try {
//     const [posts] = await db.query(`
//       SELECT p.post_id, p.title, p.created_at, u.nickname as author
//       FROM POST p
//       JOIN USER u ON p.author_id = u.user_id
//       ORDER BY p.created_at DESC
//     `);
//     res.status(200).json(posts);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: '서버 오류' });
//   }
// };

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);

  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    return res.status(400).json({ error: '유효하지 않은 페이지 또는 limit 값입니다.' });
  }

  try {
    const [[{ totalPosts }]] = await db.query('SELECT COUNT(*) as totalPosts FROM Post');
    const totalPages = Math.ceil(totalPosts / limit);
    const offset = (page - 1) * limit;

    // 1. DB에서 데이터를 가져옵니다 (SQL은 이전과 동일합니다).
    const [postsFromDB] = await db.query(`
      SELECT p.post_id, p.title, p.content, p.created_at, u.nickname as author_nickname
      FROM POST p
      JOIN USER u ON p.author_id = u.user_id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    // 2. 프론트엔드가 원하는 중첩 구조로 데이터를 가공합니다.
    const formattedPosts = postsFromDB.map(post => ({
      post_id: post.post_id,
      title: post.title,
      content: post.content,
      created_at: post.created_at,
      author: {
        id: post.author_id,
        nickname: post.author_nickname
      }
    }));

    // 3. 가공된 데이터와 페이지네이션 정보를 함께 응답합니다.
    res.status(200).json({
      posts: formattedPosts,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalPosts: totalPosts
      }
    });

  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: '서버 오류' });
  }
};


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

    const postData = postResult[0];

    // 4. 최종적으로 게시글 정보와 계층화된 댓글 목록을 함께 응답합니다.

    res.status(200).json({
      post_id: postData.post_id,
      title: postData.title,
      content: postData.content,
      view_count: postData.view_count,
      created_at: postData.created_at,
      updated_at: postData.updated_at,
      author: {
        id: postData.author_id,
        nickname: postData.author_nickname
      },
      comments: rootComments,
    });
    // // 4. 최종적으로 게시글 정보와 계층화된 댓글 목록을 함께 응답합니다.
    // res.status(200).json({
    //   ...post,
    //   comments: rootComments,
    // });

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

// 최근 글 2개 가져오는 API
export const getLatestPosts = async (req, res) => {
  try {
    // 1. DB에서 데이터를 가져오는 SQL 쿼리는 그대로 둡니다.
    const [postsFromDB] = await db.query(`
      SELECT p.post_id, p.title, p.content, p.created_at, u.nickname as author_nickname, p.author_id
      FROM POST p
      JOIN USER u ON p.author_id = u.user_id
      ORDER BY p.created_at DESC
      LIMIT 2
    `);

    // 2. DB에서 가져온 데이터를 프론트엔드가 원하는 중첩 구조로 가공합니다.
    const formattedPosts = postsFromDB.map(post => {
      return {
        post_id: post.post_id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        // author_nickname을 author 객체 안의 nickname으로 옮겨줍니다.
        author: {
          id: post.author_id,
          nickname: post.author_nickname
        }
        // imageUrl 등 다른 필드도 필요하다면 여기에 추가합니다.
      };
    });

    // 3. 가공된 데이터를 최종적으로 응답합니다.
    res.status(200).json(formattedPosts);

  } catch (err) {
    console.error('Error fetching latest posts:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};



// ----------------------------------------------------
// 게시물 수정 (Update) 기능 추가
export const updatePost = async (req, res) => {
  const { postId } = req.params; // URL 파라미터에서 게시물 ID 가져오기 (getPostById와 일관성 유지)
  const { title, content } = req.body; // 요청 본문에서 수정할 내용 가져오기
  const { userId } = req.user; // verifyToken 미들웨어에서 추가된 로그인 사용자 ID

  try {
    // 1. 게시물이 존재하는지 확인 및 소유자 확인
    const [post] = await db.query('SELECT author_id FROM POST WHERE post_id = ?', [postId]);

    if (!post.length) {
      return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
    }

    if (post[0].author_id !== userId) {
      return res.status(403).json({ error: '이 게시물을 수정할 권한이 없습니다.' });
    }

    // 2. 게시물 업데이트
    const [result] = await db.query('UPDATE POST SET title = ?, content = ?, updated_at = NOW() WHERE post_id = ?', [
      title,
      content,
      postId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: '게시물 수정에 실패했습니다.' });
    }

    // 3. 수정된 게시물 정보 조회
    const [updatedPost] = await db.query(`
      SELECT p.*, u.nickname as author_nickname 
      FROM POST p
      JOIN USER u ON p.author_id = u.user_id
      WHERE p.post_id = ?
    `, [postId]);

    res.status(200).json({
      post_id: updatedPost[0].post_id,
      title: updatedPost[0].title,
      content: updatedPost[0].content,
      created_at: updatedPost[0].created_at,
      updated_at: updatedPost[0].updated_at,
      author: {
        id: updatedPost[0].author_id,
        nickname: updatedPost[0].author_nickname
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

// 게시물 삭제 (Delete) 기능 추가
export const deletePost = async (req, res) => {
  const { postId } = req.params; // URL 파라미터에서 게시물 ID 가져오기 (getPostById와 일관성 유지)
  const { userId } = req.user; // verifyToken 미들웨어에서 추가된 로그인 사용자 ID

  try {
    // 1. 게시물이 존재하는지 확인 및 소유자 확인
    const [post] = await db.query('SELECT author_id FROM POST WHERE post_id = ?', [postId]);

    if (!post.length) {
      return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
    }

    if (post[0].author_id !== userId) {
      return res.status(403).json({ error: '이 게시물을 삭제할 권한이 없습니다.' });
    }

    // 2. 게시물 삭제
    const [result] = await db.query('DELETE FROM POST WHERE post_id = ?', [postId]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: '게시물 삭제에 실패했습니다.' });
    }

    res.status(200).json({ message: '게시물이 성공적으로 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

