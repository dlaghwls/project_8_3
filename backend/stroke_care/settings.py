# backend/stroke_care/settings.py

from pathlib import Path
from decouple import config

# ─── 기본 설정 ─────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = config('SECRET_KEY', default='dummy-secret')
DEBUG = True

ALLOWED_HOSTS = [
    'localhost',
    'corsheaders',
    '127.0.0.1',
    '10.0.2.2',   # Android 에뮬레이터 등에서 들어오는 요청 허용
]

# ─── Application definition ─────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',    # CORS 허용
    'channels',       # WebSocket 지원 (선택)
    'rest_framework', # 🔧 추가: DRF core 앱

    'apps.patients',
    'apps.vitals',
    'apps.selfcheck',
    'apps.messaging',
    'users',          # 커스텀 User 모델
]

AUTH_USER_MODEL = 'users.User'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 🔧 CORS 미들웨어 최상단
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'stroke_care.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],   # React dev 서버에서 서빙하므로 템플릿 디렉토리 비움
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'stroke_care.wsgi.application'
ASGI_APPLICATION = 'stroke_care.asgi.application'  # Channels 사용 시만 유효

# ─── Database ────────────────────────────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ─── CORS 설정 ──────────────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite 개발 서버
    "http://127.0.0.1:5173",
]
CORS_ALLOW_HEADERS = [
    'authorization',  # ✅ Authorization 헤더 허용
    'content-type',
]
# ─── Channels (선택) ─────────────────────────────────────────────────────────
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}

# ─── Static files (개발 모드) ─────────────────────────────────────────────────
STATIC_URL = '/static/'
# 🔧 STATICFILES_DIRS 제거 — React dev 서버에서 static 파일을 서빙

# ─── REST framework 전역 설정 ────────────────────────────────────────────────
# settings.py

REST_FRAMEWORK = {
    # 🔧 오직 JSON만 반환하도록, Browsable API 비활성화
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],

    # ✅ JWT 토큰 기반 인증 추가
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        # 필요에 따라 세션 인증도 병행
        'rest_framework.authentication.SessionAuthentication',
    ],

    # ✅ 인증된 사용자만 API 접근 허용
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# ─── Logging ─────────────────────────────────────────────────────────────────
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}

CORS_ALLOW_CREDENTIALS = True



# ct 파일 올릴때 
# 업로드 파일을 서비스할 URL
MEDIA_URL = '/media/'

# 실제 파일이 저장될 디렉터리
MEDIA_ROOT = BASE_DIR / 'media'