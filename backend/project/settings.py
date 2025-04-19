INSTALLED_APPS = [
    # ... 기존 앱들 ...
    "corsheaders",    # CORS
    "channels",       # Channels
    # ... 나머지 앱들 ...
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # CORS 미들웨어가 가장 위에 오도록!
    # ... 기존 미들웨어 ...
]

# CORS 설정 (React 개발 서버와 연동)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite 기본 포트
    # 필요시 추가
    # "http://127.0.0.1:5173",
]

# Channels 설정
ASGI_APPLICATION = 'project.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}

# 개발 환경에서는 True, 배포 시에는 반드시 False로!
DEBUG = True

# 반드시 ALLOWED_HOSTS 설정 추가!
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
# 배포 서버라면 도메인/IP도 추가
# ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'your-server-ip', 'your-domain.com']
