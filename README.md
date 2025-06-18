# jg_week14

---

# 아키텍처

![](https://velog.velcdn.com/images/false90/post/1b2ad84a-5a4a-4fc6-b2b5-490305e4c41d/image.png)

## Page 별 기능

### 1. 로그인 페이지

![](https://velog.velcdn.com/images/false90/post/9ce93984-6029-4b34-90f0-ebfb3fadc8a2/image.png)

JWT 토큰을 활용하는 기본 로그인과 Google 계정을 활용한 로그인 방식, 두 가지를 구현했습니다.

### 2. 회원가입 페이지

![](https://velog.velcdn.com/images/false90/post/e0fbb542-12e9-429b-b4dc-6d31af625352/image.png)

이메일 형식이나 비밀번호 형식에 맞지 않으면 오류 메시지(ErrorMsg)를 표시하여 사용자가 형식에 맞게 제출하도록 유도합니다. 물론, 유효성 검사도 수행합니다.

### 3. 메인 페이지

![](https://velog.velcdn.com/images/false90/post/42c4336a-0982-44e6-aa6c-fdc9df53e731/image.png)

이 페이지는 배너 이미지와 가장 최근에 올라온 두 개의 글을 보여주는 LatestPostSection으로 구성됩니다. 또한, 로그인 여부에 따라 로그인/로그아웃 버튼이 변하도록 구현했습니다.

또한 로그인 여부에 따라 로그인/로그아웃 버튼 변화도 구현하였다.

### 4. 게시물 목록 확인 페이지

![](https://velog.velcdn.com/images/false90/post/a652a89e-1d08-43b2-bbac-d05c685e2f43/image.png)

게시물 목록과 글을 작성할 수 있는 글쓰기 버튼이 배치되어 있습니다. 만약 로그아웃 상태에서 글쓰기를 시도하면,

![](https://velog.velcdn.com/images/false90/post/2aeb8aa2-f83a-4a53-b41e-28f54ed29692/image.png)

위 사진과 같이 알림(alert)을 통해 로그인이 필요함을 알리고 로그인 페이지로 리다이렉트됩니다.

### 5. 게시물 상세 페이지

![](https://velog.velcdn.com/images/false90/post/a9b35265-ca8f-4e22-bb28-02fd687b3fc0/image.png)

로그아웃 상태에서는 게시물 확인은 가능하지만 댓글 작성은 불가능합니다. 로그인 후 댓글 작성이 가능하도록 구현했습니다.

![](https://velog.velcdn.com/images/false90/post/971375fe-824a-4c9c-a93f-48762208f18e/image.png)

대댓글의 경우 CommentItem을 재귀적으로 구성하여 대댓글 기능을 구현했습니다. 백엔드(BE)에서는 CommentList 형태로 댓글들을 담았습니다.
