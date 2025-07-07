# 프로젝트 개요

- **배포 Swagger 주소**: [첨부예정]
  - 호스팅: 25. 07. 07 ~ 25. 07. 19)
- **기술 스택**: NestJS, MySQL, TypeORM, AWS EC2

# 사전 요구사항

- <b>Node.js</b>: 18.x 이상
- <b>npm</b>: 최신 버전
- <b>MySQL</b>: 8.0 이상 `(로컬 실행 시)` 또는 Docker `(도커 실행 시)`

---

# 로컬 실행 가이드

## 1. MySQL을 로컬 DB로 실행

### 1) 사전 준비

- 로컬에 MySQL이 설치되어 있어야 하며, 기본 포트는 `3306`입니다.

### 2) MySQL 접속

- 터미널의 MySQL의 루트 계정으로 접속합니다.
- 비밀번호가 없는 경우 그냥 Enter를 입력합니다.

#### **Windows**

```bash
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql -u root -p -P 3306 -h 127.0.0.1
```

#### **macOS**

```bash
mysql -u root -p -P 3306 -h 127.0.0.1
```

### 3) 계정 및 DB 생성

```sql
-- 사용자 생성
CREATE USER 'dev_user'@'localhost' IDENTIFIED BY 'dev1234';

-- DB 생성
CREATE DATABASE restaurant_dev DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 권한 부여
GRANT ALL PRIVILEGES ON restaurant_dev.* TO 'dev_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4) NestJS 서버 실행

`.env.dev` 파일을 프로젝트 경로 최상단에 넣습니다.

```bash
npm install
npm run start:dev
```

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

---

# 접속 확인

서버가 정상적으로 실행되면 다음 주소에서 확인할 수 있습니다:

- <b>로컬 서버</b>: `http://localhost:3000`
  - <b> Health Check API</b>: `http://localhost:3000/api`
- <b>Swagger 문서</b>: `http://localhost:3000/api-docs`

# 문제 해결 가이드

- <b>포트 충돌</b>: 3000번 포트가 이미 사용 중인 경우, 다른 포트로 변경하거나 해당 프로세스를 종료하세요
- <b>MySQL 연결 오류</b>: 데이터베이스 연결 정보가 .env.dev 파일과 일치하는지 확인하세요
- <b>Docker 오류</b>: Docker Desktop이 실행 중인지 확인하고, 도커 컨테이너 상태를 확인하세요
