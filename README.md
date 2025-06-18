# jg_week14

---

# 게시판 API 명세서

---

## 1. 게시글 관련 API

### 1.1 게시글 목록 조회

- **URL**: `/api/posts`
- **Method**: `GET`
- **인증 필요**: 아니오
- **파라미터**:
  - `page` (query, optional): 페이지 번호 (기본값: 1)
  - `limit` (query, optional): 페이지당 게시글 수 (기본값: 10)
- **응답**:

  ```json
  {
    "posts": [
      {
        "post_id": 1,
        "title": "게시글 제목",
        "content": "게시글 내용",
        "created_at": "2023-05-20T12:00:00Z",
        "author": {
          "id": 1,
          "nickname": "작성자"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalPosts": 42
    }
  }
  ```

- **에러 응답**:
  - `400 Bad Request`: 유효하지 않은 페이지 또는 limit 값
    ```json
    {
      "code": 400,
      "message": "유효하지 않은 페이지 또는 limit 값"
    }
    ```
  - `500 Internal Server Error`: 서버 오류
    ```json
    {
      "code": 500,
      "message": "서버 오류"
    }
    ```

### 1.2 최신 게시글 조회

- **URL**: `/api/posts/latest`
- **Method**: `GET`
- **인증 필요**: 아니오
- **응답**:

  ```json
  [
    {
      "post_id": 1,
      "title": "최신 게시글 제목",
      "content": "게시글 내용",
      "created_at": "2023-05-20T12:00:00Z",
      "author": {
        "id": 1,
        "nickname": "작성자"
      }
    }
  ]
  ```

- **에러 응답**:
  - `500 Internal Server Error`: 서버 오류
    ```json
    {
      "code": 500,
      "message": "서버 오류"
    }
    ```

### 1.3 게시글 상세 조회

- **URL**: `/api/posts/:postId`
- **Method**: `GET`
- **인증 필요**: 아니오
- **파라미터**:
  - `postId` (path): 게시글 ID
- **응답**:

  ```json
  {
    "post_id": 1,
    "title": "게시글 제목",
    "content": "게시글 내용",
    "view_count": 42,
    "created_at": "2023-05-20T12:00:00Z",
    "updated_at": "2023-05-21T12:00:00Z",
    "author": {
      "id": 1,
      "nickname": "작성자"
    },
    "comments": [
      {
        "comment_id": 1,
        "content": "댓글 내용",
        "created_at": "2023-05-20T12:30:00Z",
        "author_id": 2,
        "author_nickname": "댓글작성자",
        "replies": []
      }
    ]
  }
  ```

- **에러 응답**:
  - `404 Not Found`: 게시글을 찾을 수 없음
    ```json
    {
      "code": 404,
      "message": "게시글을 찾을 수 없음"
    }
    ```
  - `500 Internal Server Error`: 서버 오류
    ```json
    {
      "code": 500,
      "message": "서버 오류"
    }
    ```

### 1.4 게시글 작성

- **URL**: `/api/posts`
- **Method**: `POST`
- **인증 필요**: 예 (JWT 토큰)
- **요청 본문**:

  ```json
  {
    "title": "새 게시글 제목",
    "content": "새 게시글 내용"
  }
  ```

- **응답**:

  ```json
  {
    "post_id": 1,
    "title": "새 게시글 제목",
    "content": "새 게시글 내용",
    "author_id": 1,
    "created_at": "2023-05-20T12:00:00Z"
  }
  ```

- **에러 응답**:
  - `401 Unauthorized`: 인증되지 않음
    ```json
    {
      "code": 401,
      "message": "인증되지 않음"
    }
    ```
  - `500 Internal Server Error`: 서버 오류
    ```json
    {
      "code": 500,
      "message": "서버 오류"
    }
    ```

### 1.5 게시글 수정

- **URL**: `/api/posts/:postId`
- **Method**: `PUT`
- **인증 필요**: 예 (JWT 토큰)
- **파라미터**:
  - `postId` (path): 게시글 ID
- **요청 본문**:

  ```json
  {
    "title": "수정된 제목",
    "content": "수정된 내용"
  }
  ```

- **응답**:

  ```json
  {
    "post_id": 1,
    "title": "수정된 제목",
    "content": "수정된 내용",
    "created_at": "2023-05-20T12:00:00Z",
    "updated_at": "2023-05-21T12:00:00Z",
    "author": {
      "id": 1,
      "nickname": "작성자"
    }
  }
  ```

- **에러 응답**:
  - `401 Unauthorized`: 인증되지 않음
    ```json
    {
      "code": 401,
      "message": "인증되지 않음"
    }
    ```
  - `403 Forbidden`: 권한 없음 (작성자가 아닌 경우)
    ```json
    {
      "code": 403,
      "message": "권한 없음 (작성자가 아닌 경우)"
    }
    ```
  - `404 Not Found`: 게시글을 찾을 수 없음
    ```json
    {
      "code": 404,
      "message": "게시글을 찾을 수 없음"
    }
    ```
  - `500 Internal Server Error`: 서버 오류
    ```json
    {
      "code": 500,
      "message": "서버 오류"
    }
    ```

### 1.6 게시글 삭제

- **URL**: `/api/posts/:postId`
- **Method**: `DELETE`
- **인증 필요**: 예 (JWT 토큰)
- **파라미터**:
  - `postId` (path): 게시글 ID
- **응답**:

  ```json
  {
    "message": "게시물이 성공적으로 삭제되었습니다."
  }
  ```

- **에러 응답**:
  - `401 Unauthorized`: 인증되지 않음
    ```json
    {
      "code": 401,
      "message": "인증되지 않음"
    }
    ```
  - `403 Forbidden`: 권한 없음 (작성자가 아닌 경우)
    ```json
    {
      "code": 403,
      "message": "권한 없음 (작성자가 아닌 경우)"
    }
    ```
  - `404 Not Found`: 게시글을 찾을 수 없음
    ```json
    {
      "code": 404,
      "message": "게시글을 찾을 수 없음"
    }
    ```
  - `500 Internal Server Error`: 서버 오류
    ```json
    {
      "code": 500,
      "message": "서버 오류"
    }
    ```

---

## 2. 댓글 관련 API

### 2.1 댓글 작성

- **URL**: `/api/posts/:postId/comments`
- **Method**: `POST`
- **인증 필요**: 예 (JWT 토큰)
- **파라미터**:
  - `postId` (path): 게시글 ID
- **요청 본문**:

  ```json
  {
    "content": "댓글 내용",
    "parent_comment_id": null
  }
  ```

  - `parent_comment_id`는 대댓글인 경우 부모 댓글 ID, 아니면 `null`

- **응답**:

  ```json
  {
    "comment_id": 1,
    "post_id": 1,
    "author_id": 2,
    "content": "댓글 내용",
    "parent_comment_id": null,
    "created_at": "2023-05-20T12:30:00Z"
  }
  ```

- **에러 응답**:
  - `401 Unauthorized`: 인증되지 않음
    ```json
    {
      "code": 401,
      "message": "인증되지 않음"
    }
    ```
  - `500 Internal Server Error`: 서버 오류
    ```json
    {
      "code": 500,
      "message": "서버 오류"
    }
    ```
