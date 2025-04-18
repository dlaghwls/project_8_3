# StrokeCare+ 프로젝트 구조 안내

이 문서는 각 디렉토리/파일의 역할을 설명합니다.  
팀원들은 본인이 담당하는 영역에 맞춰 아래 구조에 따라 작업을 진행하면 됩니다.
``` 
├── backend/                         # Django 백엔드 루트
│   ├── apps/                        # 기능별 모듈 앱들
│   │   ├── accounts/                # 사용자 인증, JWT 로그인/회원가입
│   │   ├── core/                    # 공통 모델 정의 (User 등)
│   │   ├── patients/                # 환자 등록 API
│   │   ├── vitals/                  # 환자 바이탈 입력 API
│   │   ├── messaging/               # 의사↔간호사 메시지 전송 기능
│   │   ├── dashboard/               # 위험도 계산 + 환자 정렬 API
│   │   └── selfcheck/               # 환자 자가 문진 결과 저장 API
│   ├── utils/                       # 공통 함수, 상수, 유효성 검사 등
│   ├── stroke_care/                 # Django 전역 설정 모듈
│   │   ├── settings.py              # Django 전체 설정 파일
│   │   ├── urls.py                  # 앱별 URL 경로 포함
│   │   ├── wsgi.py                  # WSGI 서버 실행용
│   │   └── asgi.py                  # ASGI 서버 실행용
│   ├── manage.py                    # Django 명령어 실행 진입점
│   ├── Dockerfile                   # 백엔드용 Docker 빌드 설정
│   ├── requirements.txt             # 백엔드 Python 패키지 목록
│   └── .env.example                 # 환경변수 템플릿
├── frontend/                        # React 기반 웹 프론트엔드
│   ├── public/                      # 정적 파일, index.html 포함
│   │   └── index.html               # SPA 진입점 HTML
│   ├── src/                         # 핵심 소스 디렉토리
│   │   ├── assets/                  # 이미지, 폰트 등 정적 자산
│   │   ├── components/              # 재사용 가능한 컴포넌트 모음
│   │   ├── hooks/                   # 커스텀 React 훅
│   │   ├── pages/                   # 각 라우트별 페이지 컴포넌트
│   │   ├── services/                # API 통신 함수들
│   │   ├── store/                   # 전역 상태 관리 (예: Redux)
│   │   ├── styles/                  # CSS, 스타일 모듈
│   │   ├── utils/                   # 공통 유틸 함수
│   │   ├── App.tsx                  # 앱 루트 컴포넌트
│   │   ├── index.tsx                # React DOM 렌더링 시작점
│   │   └── routes.tsx               # 라우팅 경로 정의
│   ├── Dockerfile                   # 프론트엔드 Docker 빌드 설정
│   ├── package.json                 # 의존성 및 스크립트 정의
│   └── tsconfig.json                # TypeScript 설정 파일
├── mobile/                          # Flutter 기반 모바일 앱 (환자용)
│   ├── lib/                         # Dart 소스 파일
│   │   ├── models/                  # 데이터 모델 클래스들
│   │   ├── services/                # API 통신 로직
│   │   ├── screens/                 # 화면 UI 페이지들
│   │   ├── widgets/                 # 재사용 가능한 Flutter 위젯들
│   │   ├── utils/                   # 공통 함수 모음
│   │   └── main.dart                # 앱 실행 진입점
│   ├── pubspec.yaml                 # Flutter 설정 및 의존성
│   ├── android/                     # 안드로이드 플랫폼 설정
│   └── ios/                         # iOS 플랫폼 설정
├── docs/                            # 프로젝트 문서 모음
│   ├── architecture.md              # 시스템 아키텍처 개요
│   ├── api-spec.md                  # API 명세서
│   └── infra-guide.md               # 인프라 구성 가이드
├── infra/                           # 인프라 배포/네트워크 설정
│   ├── docker-compose.yml           # 전체 서비스 통합 실행 구성
│   ├── nginx/
│   │   └── stroke-care.conf         # 리버스 프록시 설정 파일
│   └── terraform/                   # IaC (인프라 코드) 구성
├── scripts/                         # 개발 및 배포 자동화 스크립트
│   ├── init-db.sh                   # DB 초기화 스크립트
│   ├── build-all.sh                 # 전체 빌드 실행
│   └── deploy.sh                    # 서버 배포 자동화
├── .github/                         # GitHub 자동화 (CI/CD)
│   ├── ISSUE_TEMPLATE.md            # 이슈 등록 템플릿
│   ├── PULL_REQUEST_TEMPLATE.md     # PR 작성 템플릿
│   └── workflows/
│       ├── backend-ci.yml           # 백엔드 자동화 파이프라인
│       └── frontend-ci.yml          # 프론트엔드 자동화 파이프라인
├── .vscode/                         # 팀 공용 VSCode 개발 설정
│   ├── settings.json                # 포맷터, 경고 등 설정
│   ├── extensions.json              # 추천 확장 목록
│   └── launch.json                  # 디버깅 설정
├── README.md                        # 프로젝트 설명서 (이 문서)
└── .gitignore                       # Git 추적 제외 목록
``` 
---

## 작업 시 참고 사항

- Django 앱별 기능은 `apps/` 폴더 기준으로 분리되어 있습니다.
- 공통 함수/상수는 `backend/utils/`에서 관리합니다.
- 코드 push 전에는 반드시 기능 단위 브랜치로 작업 후 PR 생성해주세요. 
- 환경변수는 `.env.example` 참고하여 `.env` 따로 생성해야 합니다. 
- API 명세나 시스템 흐름은 `docs/` 폴더 참고 바랍니다.
- 모르는 내용은 팀과 GPT에게 문의.
- 보내고 싶지 않은 파일은 .gitignore에 적어주세요. README.md 꼭 적어주세요, main 갈아 끼울 때 추가했던 말이 자꾸 덮어씌워져서 없어지더라고요...
- 빈폴더는 git에 올라가지 않습니다. 주의해주세요.

---
