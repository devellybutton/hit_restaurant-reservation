# 🍽️ 레스토랑 예약 서비스

채용 과제로 제작한 레스토랑 예약 백엔드 서비스입니다.  
고객 계정과 식당 계정의 각각의 인증 기능, 메뉴 등록 및 조회, 예약 기능 등을 제공합니다.

---

## 🔗 배포 링크

- **배포 Swagger 주소**: http://54.180.29.163:3000/api-docs#/
- **배포 기한**: 25. 07. 07 ~ 25. 07. 28

---
## 📄 DB 구조 SQL 파일

- [`database.sql`](./database.sql): 전체 테이블 구조 (DDL)

## 🛠️ 기술 스택

- **Backend**: NestJS, TypeORM
- **Database**: MySQL 8.0+
- **Infra**: AWS EC2, Docker

---

## 📦 주요 기능

- [x] 고객 / 식당 로그인 (JWT 인증)
- [x] 식당 전용 메뉴 등록/조회/삭제
- [x] 예약 생성 및 조회 (유효성 검사 포함)
- [x] Swagger를 통한 API 문서 제공
- [x] 공통 응답 포맷 및 예외 처리 적용

---

## 🧪 테스트 계정 (더미 데이터)

### 고객용 계정

| 번호 | ID           | 비밀번호      |
| ---- | ------------ | ------------- |
| 1    | `customer01` | `Password123` |
| 2    | `customer02` | `Password123` |
| 3    | `customer03` | `Password123` |

### 식당용 계정

| 번호 | ID             | 비밀번호      |
| ---- | -------------- | ------------- |
| 1    | `restaurant01` | `Password123` |
| 2    | `restaurant02` | `Password123` |

> <i>실제 비밀번호는 해시되어 저장되어 있습니다.</i>

---

## 로컬 실행 가이드

### 1. 로컬 MySQL로 실행

✅ [여기를 클릭하면 자세히 보기](./_docs/01-mysql-local.md)

### 2. Docker로 실행

✅ [여기를 클릭하면 자세히 보기](./_docs/02-mysql-docker.md)

> 실행 후 Swagger: http://localhost:3000/api-docs

---

## 🔍 문제 해결 가이드

- 포트 충돌 시: `.env.dev`에서 포트 번호 변경
- MySQL 접속 오류: `.env.dev`의 설정값이 MySQL 사용자 정보와 일치하는지 확인
- Docker 사용 시: Docker Desktop 실행 여부 확인

---

## 📁 기타 참고

- Swagger 경로: `/api-docs`
- API Prefix: `/api`
- Health Check: `/api` (서버 + DB 연결 상태 확인)
