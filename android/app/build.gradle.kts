plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    // 앱의 패키지 네임스페이스
    namespace = "com.example.stroke_care_mobile"

    compileSdk = flutter.compileSdkVersion

    // NDK 버전 고정 (플러그인에서 요구하는 27.0.12077973)
    ndkVersion = "27.0.12077973"

    defaultConfig {
        applicationId = "com.example.stroke_care_mobile"
        minSdk        = flutter.minSdkVersion
        targetSdk     = flutter.targetSdkVersion
        versionCode   = flutter.versionCode
        versionName   = flutter.versionName
    }

    compileOptions {
        // Java 8 언어 기능 사용 및 desugaring 활성화
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
        isCoreLibraryDesugaringEnabled = true
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

dependencies {
    // desugaring을 위해 반드시 추가
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:1.1.5")

    // Flutter가 자동으로 관리하는 종속성 이외에
    // 필요한 라이브러리가 있다면 여기에 추가합니다.
}

flutter {
    source = "../.."
}