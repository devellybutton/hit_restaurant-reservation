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
