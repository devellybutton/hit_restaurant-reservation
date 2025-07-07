## 2. MySQL을 도커로 실행

### 1) 환경 설정

- `.env.dev` 파일을 프로젝트 경로 최상단에 넣습니다.

### 2) 도커 컨테이너 실행

도커 데몬을 먼저 실행한 후, 터미널에 아래 명령어를 입력합니다.

```bash
# MySQL 컨테이너 실행
npm run docker:dev:up
```

### 3) NestJS 서버 실행

터미널에 아래 명령어를 입력합니다.

```bash
# 의존성 설치 (최초 실행 시)
npm install

# NestJS 서버 실행
npm run start:dev
```

### 4) 도커 컨테이너 종료

```bash
# MySQL 컨테이너 종료
npm run docker:dev:down
```
