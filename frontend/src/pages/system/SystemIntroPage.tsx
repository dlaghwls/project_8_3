// src/pages/system/SystemIntroPage.tsx 수정 버전 (AI 다이어그램 부분 수정)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SystemIntroPage.css';

// 이미지 가져오기
import logoImage from '../../assets/images/logo.png';
import systemDiagramImage from '../../assets/images/system-diagram.png';
import systemFlowImage from '../../assets/images/system-flow.png';
// AI 다이어그램 이미지 임포트 제거

const SystemIntroPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="system-intro-container">
      {/* Header */}
      <header className="system-intro-header">
        <div className="logo-container" onClick={() => navigate('/')}>
          <img src={logoImage} alt="StrokeCare+ Logo" className="logo" />
          <h1 className="logo-text">StrokeCare+</h1>
        </div>
        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/" className="active">시스템소개</a>
            </li>
            <li className="nav-item">
              <a href="/#doctors">의료진소개</a>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <button className="login-button" onClick={() => navigate('/login')}>로그인</button>
          <button className="join-button" onClick={() => navigate('/signup')}>회원가입</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="system-intro-main">
        <div className="intro-header">
          <div className="intro-title-container">
            <h1 className="intro-number">01</h1>
            <h2 className="intro-title">프로젝트 개요 및 목적</h2>
          </div>
          <div className="intro-subtitle">
            <h3>CDSS (Clinical Decision Support System)</h3>
          </div>
        </div>

        <section className="intro-section">
          <div className="intro-grid">
            <div className="intro-card">
              <h3>통합 의료 시스템 구축 배경</h3>
              <ul>
                <li>뇌졸중 환자 진단 및 관리 과정은 영상(PACS), 검사 결과(LIS), 환자 기록(EMR) 등 다양한 데이터가 분산되어 있음</li>
                <li>의료진이 효율적인 진단 및 의사결정을 내리기 어렵고, 환자 또한 통합된 진료 이력 확인이 불가능함</li>
                <li>기존의 시스템은 통합되지 않은 수작업에 의존, 정보 누락 또는 진단 지연의 위험이 존재함</li>
              </ul>
            </div>
            <div className="intro-card">
              <h3>CDSS 기반 기술 통합 플랫폼 개발</h3>
              <ul>
                <li>핵심 구성 요소</li>
                <li>백엔드(Django): 사용자 인증, API, AI 분석, FHIR/PACS/LIS 연동 처리</li>
                <li>프론트엔드(React): 의료진용 웹뷰어로 영상 및 검사 결과 제공</li>
                <li>모바일 앱(Flutter): 환자용 앱으로 진료/검사 내역 조회 가능</li>
                <li>GCP VM 배포: 외부 접근 가능한 HTTPS 기반 서비스 인프라 구성</li>
                <li>AI 진단 지원: CT/MRI 영상에 대해 뇌졸중 여부 예측 (ResUNet 등)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="diagram-section">
          <h3>시스템 구성도</h3>
          <div className="diagram-container">
            <img src={systemDiagramImage} alt="시스템 구성도" className="diagram-image" />
          </div>
        </section>

        <section className="flow-section">
          <h3>데이터 흐름도</h3>
          <div className="flow-container">
            <div className="flow-grid">
              <div className="flow-column">
                <h4>자가진단 접수 → 위험도 계산 알고리즘</h4>
                <div className="flow-steps">
                  <div className="flow-step">
                    <p>Flutter 앱 입력 (예/아니오, 선택지 등)</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>접수 매핑 (각 질문마다 가중치 부여)</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>접수 종합 계산</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>위험도 등급 분류<br />0~10점: 낮음<br />11~20점: 중간<br />21점 이상: 높음</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>Django API 전송 → DB 저장</p>
                  </div>
                </div>
              </div>

              <div className="flow-column">
                <h4>의료 영상 분석</h4>
                <div className="flow-steps">
                  <div className="flow-step">
                    <p>Orthanc Webhook or REST API로 이미지 수신</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>Django 서버에서 pydicom으로 DICOM 파싱</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>환자 정보 및 메타데이터 추출</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>파일 저장 경로 생성</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>DB에 연동 (환자 정보, ID 등 저장)</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>추출 AI 분석용 또는 시각화용으로 활용</p>
                  </div>
                </div>
              </div>

              <div className="flow-column">
                <h4>검사 결과 자동 저장 (LIS 결과 → Django)</h4>
                <div className="flow-steps">
                  <div className="flow-step">
                    <p>LIS 서버에서 Django API로 JSON 전송</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>Django에서 request body 파싱</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>검사 항목 분류 및 날짜, 환자 ID 확인</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>중복 검사 방지 후 DB 저장</p>
                    <span className="arrow">↓</span>
                  </div>
                  <div className="flow-step">
                    <p>환자 상세 페이지에 연동 → 관리자 확인 가능</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ai-section">
          <h3>AI 분석 모델</h3>
          <div className="ai-text-full">
            <p>StrokeCare+는 CT 영상에서 뇌졸중 병변을 자동으로 감지하고 위험도를 평가하는 AI 모델을 활용합니다. ResUNet 기반의 딥러닝 모델을 통해 영상 데이터에서 뇌졸중 징후를 식별하고, 의료진의 진단을 지원합니다.</p>
            <p>AI 모델은 다음과 같은 기능을 제공합니다:</p>
            <ul>
              <li>뇌졸중 여부 자동 감지</li>
              <li>병변 영역 세그멘테이션 및 시각화</li>
              <li>위험도 점수화 및 진단 결과 제안</li>
              <li>시계열 분석을 통한 환자 상태 변화 추적</li>
            </ul>
            <p>의료 AI 시스템은 의료진의 판단을 보조하는 도구로, 최종 진단 및 치료 결정은 의료 전문가에 의해 이루어집니다.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="system-intro-footer">
        <p>&copy; 2025 StrokeCare+ All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default SystemIntroPage;