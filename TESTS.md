# 테스트 작업 지시서

이 문서는 AccountBook의 TypeScript 기반 Web, Mobile, API와 공통 패키지에 테스트를 추가하거나 수정할 때 따르는 기준이다. 테스트 명령은 각 workspace의 `package.json`에 정의하고 루트 `pnpm` 스크립트에서 통합한다.

## 개발 및 테스트 도구

| 대상 | 제품 코드 | 테스트 도구 | 주요 범위 |
|---|---|---|---|
| Web | Next.js, React, TypeScript | Vitest | 함수, Hook, Component, 상태와 폼 |
| Mobile | React Native, Expo, TypeScript | Jest | 화면, Hook, 상태, Navigation, 기기 Adapter |
| API | NestJS, TypeScript | Jest, Supertest | Domain/Application 및 HTTP API |
| Database | PostgreSQL, Prisma | Jest | Repository, Transaction, Migration |
| Web E2E | Next.js, NestJS | Playwright | 사용자 관점의 핵심 브라우저 흐름 |
| 품질 | TypeScript, ESLint | `tsc`, ESLint | 타입과 정적 분석 |

- 패키지 관리자는 `pnpm`을 사용한다.
- Node.js와 도구 버전은 설치 계획 및 lockfile을 기준으로 고정한다.
- 한 workspace 안에서 Vitest와 Jest를 혼용하지 않는다.
- Web과 공통 TypeScript 패키지는 Vitest, NestJS와 Expo는 Jest를 기본 runner로 사용한다.

## 테스트 분류와 위치

```text
apps/
├─ web/src/**/<target>.test.ts(x)
├─ mobile/src/**/<target>.test.ts(x)
└─ api/
   ├─ src/**/<target>.spec.ts
   └─ test/integration/**/*.spec.ts
packages/*/src/**/<target>.test.ts
tests/
├─ e2e/**/*.spec.ts
├─ fixtures/
└─ helpers/
```

| 종류 | 외부 의존성 | 위치 |
|---|---|---|
| Unit | 없음 | 대상 소스와 같은 폴더 |
| Component | DOM 또는 React Native renderer | Web/Mobile 대상 소스와 같은 폴더 |
| Integration | PostgreSQL, NestJS app, 내부 Adapter | `apps/api/test/integration/` |
| Contract | OpenAPI schema와 client | API 또는 공유 contract package |
| E2E | 실행 중인 Web/API/DB | `tests/e2e/` |

실제 workspace 구조가 다르면 기존 구조를 우선하되 Unit, Integration, E2E 경계는 유지한다.

## 파일과 테스트 이름

- Vitest/Jest는 `*.test.ts(x)` 또는 NestJS 관례의 `*.spec.ts`를 사용한다.
- Playwright는 `*.spec.ts`를 사용한다.
- 이름은 구현 방식이 아니라 관찰 가능한 행동과 조건을 설명한다.
- 하나의 테스트는 하나의 실패 원인을 갖도록 작성한다.

```ts
describe('calculateRemainingBudget', () => {
  it('returns the remaining amount after expenses', () => {
    expect(calculateRemainingBudget(100_000, 35_000)).toBe(65_000);
  });

  it('returns a negative amount when the budget is exceeded', () => {
    expect(calculateRemainingBudget(100_000, 120_000)).toBe(-20_000);
  });
});
```

## 공통 작성 규칙

- Arrange, Act, Assert 흐름이 드러나게 작성한다.
- public API와 관찰 가능한 결과를 검증하고 private 구현은 직접 테스트하지 않는다.
- 정상, 경계값, 잘못된 입력과 권한 실패를 필요한 범위에서 검증한다.
- 테스트 순서나 공유 전역 상태에 의존하지 않는다.
- 시간, timezone, 난수, UUID와 네트워크 응답을 고정한다.
- 금액은 부동소수점 대신 최소 화폐 단위 정수 또는 Decimal 정책대로 검증한다.
- 출력이나 snapshot만으로 성공을 판단하지 않고 명시적인 assertion을 둔다.
- `it.only`, `describe.only`, `test.only`와 불필요한 `skip`을 커밋하지 않는다.
- 제품 코드에 테스트 전용 분기를 추가하지 않는다.

## 계층별 기준

### Domain / Application

- Entity, Value Object, 계산 규칙과 상태 전이는 빠른 Unit test로 검증한다.
- Use Case의 Repository, Clock, Queue와 File Storage Port는 fake 또는 mock으로 대체한다.
- 거래, 예산과 잔액 규칙은 성공 및 거절 조건을 모두 검증한다.
- Domain test에서 NestJS, Prisma, HTTP 또는 Redis를 import하지 않는다.

### Web

- 함수, Hook, 상태와 폼 schema는 Vitest로 검증한다.
- Component는 사용자에게 보이는 text, role, label과 상호작용으로 검증한다.
- Router, Clock과 API client는 테스트 경계에서 대체한다.
- TanStack Query test마다 독립 QueryClient를 만들고 retry를 비활성화한다.
- 내부 state, CSS class와 자식 구조에 과도하게 의존하지 않는다.

### Mobile

- 화면, Hook, Zustand 상태와 Expo Adapter는 Jest로 검증한다.
- SecureStore, 알림, 카메라, 파일 선택과 Network API는 mock Adapter를 사용한다.
- Navigation은 사용자의 이동 결과와 전달 parameter를 검증한다.
- 오프라인 입력 보존, 재연결, 중복 요청과 인증 만료 복구를 검증한다.
- 실제 기기가 필요하면 자동 테스트와 분리해 수동 검증 조건을 문서화한다.

### API

- Domain/Application 규칙에 Unit test 우선순위를 둔다.
- HTTP 통합 테스트는 NestJS test application과 Supertest를 사용한다.
- 상태 코드, 응답 schema, 오류 code, 인증/인가와 validation 실패를 검증한다.
- test application과 resource는 `afterAll`에서 종료한다.
- OCR, 알림, 환율과 금융기관 호출은 test double로 대체한다.

### Database / Prisma

- Repository와 transaction은 실제 PostgreSQL을 사용하는 Integration test로 검증한다.
- 개인 DB가 아닌 테스트 전용 database/schema를 사용한다.
- transaction rollback 또는 cleanup으로 테스트를 격리한다.
- Migration, unique/foreign key/check constraint와 주요 index를 검증한다.
- DB URL, password 또는 token을 코드와 로그에 남기지 않는다.
- Redis 유실이나 cache miss가 원장 데이터 유실로 이어지지 않는지 검증한다.

### Queue / Worker

- Job producer와 consumer의 payload contract를 검증한다.
- 동일 업무 key 재전달에도 결과가 중복 생성되지 않는 멱등성을 검증한다.
- retry, backoff와 dead-letter 처리를 검증한다.
- Scheduler는 fake timer와 고정 Clock을 사용한다.

### E2E

- Playwright로 거래 CRUD, 예산, 계좌/자산과 리포트 핵심 흐름을 검증한다.
- role, label과 안정적인 `data-testid`를 selector로 사용한다.
- 임의 sleep 대신 자동 대기와 상태 assertion을 사용한다.
- 사용자와 데이터를 테스트별로 격리한다.
- 실패 시 trace, screenshot과 video를 CI artifact로 보관한다.
- 외부 운영 서비스와 production data를 사용하지 않는다.

## Mock, Fake와 Fixture

- Domain/Application Unit test에는 in-memory fake Port를 우선 사용한다.
- HTTP mock은 실제 OpenAPI 응답 schema를 따른다.
- 공통 fixture는 `tests/fixtures/`, helper는 `tests/helpers/`에 둔다.
- 날짜, 금액, 통화, 사용자와 household ID를 명시한다.
- 개인정보와 실제 영수증·계좌 데이터를 사용하지 않는다.

## 실행 명령 계약

프로젝트 scaffold가 생성되면 루트 `package.json`에 다음 스크립트를 제공한다.

```powershell
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm test
pnpm test:coverage
```

개별 workspace는 실제 package name으로 실행한다.

```powershell
pnpm --filter <package-name> test
pnpm --filter <package-name> test:watch
```

CI에서는 watch mode를 사용하지 않는다.

## CI 품질 게이트

Pull Request에서 다음 순서로 검증한다.

1. `pnpm install --frozen-lockfile`
2. `pnpm lint`
3. `pnpm typecheck`
4. `pnpm test:unit`
5. `pnpm test:integration`
6. build
7. 핵심 Playwright E2E

- 하나라도 실패하거나 비정상 종료되면 CI를 실패시킨다.
- Domain/Application 핵심 모듈은 line/branch/function/statement coverage 80% 이상을 목표로 한다.
- flaky test를 재시도로 숨기지 않는다. 즉시 수정할 수 없으면 담당자와 복구 기한을 기록해 격리한다.
- coverage와 실패 artifact에 secret 및 개인정보가 포함되지 않게 한다.

## 새 테스트 체크리스트

- [ ] Unit, Component, Integration, Contract, E2E 중 올바른 계층에 배치했다.
- [ ] workspace의 runner와 파일명 규칙을 따랐다.
- [ ] 성공과 중요한 실패·경계 조건을 assertion으로 검증한다.
- [ ] 시간, timezone, 난수와 ID가 고정되어 있다.
- [ ] Unit test가 실제 DB, Redis, Storage 또는 외부 API를 호출하지 않는다.
- [ ] Integration test가 전용 환경을 사용하고 resource를 정리한다.
- [ ] 인증정보, 개인정보와 실제 금융 데이터가 fixture, snapshot, log에 없다.
- [ ] focus test와 불필요한 skip이 없다.
- [ ] 관련 테스트와 루트 lint/typecheck가 통과한다.
- [ ] 새 기능에 핵심 성공 테스트와 실패 테스트가 있다.
