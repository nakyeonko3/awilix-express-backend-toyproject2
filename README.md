# Awilix Express Backend

이 프로젝트는 토이프로젝트2를 위한 백엔드 코드입니다. Express.js와 Awilix를 사용하여 구축되었으며, SQLite 데이터베이스를 활용합니다.

## 기술 스택

- Node.js
- Express.js
- Awilix (의존성 주입)
- SQLite
- Morgan (HTTP 요청 로깅)
- Nodemon (개발 시 자동 서버 재시작)

## 시작하기

### 사전 요구사항

- Node.js (버전 14 이상 권장)
- npm (Node.js와 함께 설치됨)

## 설치 및 실행

```bash
git clone https://github.com/nakyeonko3/awilix-express-backend-toyproject2
cd ./awilix-express-backend-toyproject2
npm i
npm run start # node ./server.js
```

개발하기 위해서 nodemon으로 서버로 실행하고 싶다면 `npm i` 명령어 이후에 아래의 명령어를 입력하시오

```bash
# or want to use nodemon
npm run server
```

## ERD 

![](https://i.imgur.com/HokagIE.png)

## 참고

### 관련 프로젝트 링크
해당 프로젝트의 백엔드 서버를 구현함.
https://github.com/Dev-FE-1/team2-intranet-project-

### 프로젝트에 사용된 sql 쿼리문 정리 
[awilix-express-backend-toyproject2/databaseDegin.md at main · nakyeonko3/awilix-express-backend-toyproject2 · GitHub](https://github.com/nakyeonko3/awilix-express-backend-toyproject2/blob/main/databaseDegin.md)
