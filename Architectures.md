# System Architectures

가계부 시스템의 Architecture TASK에 정의된 제품과 역할을 기능별로 모아 본 문서이다. 상세 설계와 작업 상태는 연결된 `TASK-07` 문서를 기준으로 한다.

## 핵심 제품 한눈에 보기

| 기능 영역 | 주요 제품 | 언어 | 주요 역할 | 기준 TASK |
|---|---|---|---|---|
| 웹 | Next.js 14, React 18 | TypeScript | 반응형 웹 UI, App Router 기반 라우팅, API 연동 | [TASK-07000000](tasks/TASK-07000000.md) |
| 모바일 | React Native, Expo | TypeScript | iOS/Android 앱 UI, 기기 기능, 보안 저장소, 푸시 알림 | [TASK-07060000](tasks/TASK-07060000.md) |
| 웹서버/API | NestJS | TypeScript | REST API, 인증, 유스케이스 실행, 도메인 규칙 처리 | [TASK-07010000](tasks/TASK-07010000.md) |
| DB | PostgreSQL 16, Prisma | SQL, TypeScript | 영속 데이터 저장, 타입 안전 데이터 접근, 스키마 관리 | [TASK-07020000](tasks/TASK-07020000.md) |
| 프록시 | Nginx | Nginx Configuration | TLS 종료, Web/API 라우팅, 압축, 캐시, 요청 제한 | [TASK-07030000](tasks/TASK-07030000.md) |

## 웹

| 용도 | 제품 |
|---|---|
| Framework / Routing | Next.js 14 App Router |
| UI Runtime | React 18 |
| Styling / Components | Tailwind CSS, shadcn/ui |
| Form / Validation | React Hook Form, Zod |
| Server State | TanStack Query |
| Local State | Zustand |
| HTTP Client | Axios |
| Chart | Recharts |
| Date / Time | date-fns |
| Notification | react-hot-toast |

웹은 화면 렌더링, 사용자 입력 검증과 API 소비를 담당한다. 업무 규칙과 영속 데이터 처리는 웹에 두지 않고 NestJS API에 위임한다.

## 모바일

| 용도 | 제품 |
|---|---|
| Framework | React Native, Expo |
| Routing | Expo Router |
| Server State | TanStack Query |
| Local State | Zustand |
| Secure Storage | Expo SecureStore |
| API Contract | OpenAPI 기반 TypeScript Client |

모바일은 iOS/Android 화면, 기기 기능과 푸시 알림을 담당한다. 인증 토큰은 OS 보안 저장소에 보관하고, 오프라인 충돌 데이터는 서버 확인 없이 자동 병합하지 않는다.

## 웹서버/API

| 용도 | 제품 |
|---|---|
| Framework | NestJS |
| API | REST, OpenAPI/Swagger |
| Validation | class-validator, class-transformer |
| Authentication | Passport, JWT |
| Dependency Injection | NestJS DI Container |
| Background Job | BullMQ |
| Cache / Queue | Redis |

웹서버는 Domain, Application, Interface, Infrastructure 계층을 분리한다. Controller는 Use Case를 호출하고, Use Case는 Port를 통해 저장소와 외부 서비스를 사용한다.

## DB

| 용도 | 제품 |
|---|---|
| Relational Database | PostgreSQL 16 |
| ORM | Prisma |
| Migration | Prisma Migrate |
| Connection Pool | PgBouncer |
| Backup / Restore | pg_dump, pg_restore |
| Point-in-time Recovery | PostgreSQL WAL Archive |

PostgreSQL을 거래, 예산, 계좌, 부채와 감사 데이터의 단일 진실 원천으로 사용한다. Redis는 영속 원장을 대신하지 않는다.

## 프록시

| 용도 | 제품 |
|---|---|
| Reverse Proxy | Nginx |
| TLS Certificate | Let's Encrypt, Certbot |
| Compression | gzip, Brotli |
| Metrics | Prometheus Exporter |
| Logging | Nginx Access/Error Log |

Nginx에서 `/api` 요청은 NestJS로, 그 외 웹 요청은 Next.js로 전달한다. TLS, 보안 헤더, 정적 자산 캐시, 압축과 rate limit을 외부 트래픽 경계에서 처리한다.

## 전체 요청 흐름

```text
Web (Next.js) ───────┐
                     ├─> Nginx ─> NestJS API ─┬─> PostgreSQL / Prisma
Mobile (Expo) ───────┘                        ├─> Redis / BullMQ ─> Worker
                                              └─> S3-compatible Storage
```

## 관련 공통 인프라

| 기능 | 제품 | 역할 |
|---|---|---|
| Cache / Queue | Redis, BullMQ | 캐시, 작업 큐, 분산 잠금과 멱등성 키 |
| File Storage | MinIO(개발), S3 호환 저장소(운영) | 영수증 이미지와 백업 파일 저장 |
| Local Deployment | Docker Compose | 개발 의존 서비스 실행 |
| CI/CD | GitHub Actions | 검증, 빌드와 배포 자동화 |
| Observability | OpenTelemetry, Prometheus, Grafana, Sentry | 로그·메트릭·Trace와 오류 추적 |

## 원본 Architecture TASK

- 전체 설계: [TASK-00000003](tasks/TASK-00000003.md)
- 웹: [TASK-07000000](tasks/TASK-07000000.md), [TASK-07000001](tasks/TASK-07000001.md), [TASK-07000002](tasks/TASK-07000002.md)
- 모바일: [TASK-07060000](tasks/TASK-07060000.md), [TASK-07060001](tasks/TASK-07060001.md), [TASK-07060002](tasks/TASK-07060002.md)
- 웹서버/API: [TASK-07010000](tasks/TASK-07010000.md), [TASK-07010001](tasks/TASK-07010001.md), [TASK-07010002](tasks/TASK-07010002.md)
- DB: [TASK-07020000](tasks/TASK-07020000.md), [TASK-07020001](tasks/TASK-07020001.md), [TASK-07020002](tasks/TASK-07020002.md)
- 프록시: [TASK-07030000](tasks/TASK-07030000.md), [TASK-07030001](tasks/TASK-07030001.md), [TASK-07030002](tasks/TASK-07030002.md)
- 인프라/운영: [TASK-07040000](tasks/TASK-07040000.md), [TASK-07050000](tasks/TASK-07050000.md)
