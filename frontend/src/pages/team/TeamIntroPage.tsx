// src/pages/team/TeamIntroPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamIntroPage.css';

// 로고 이미지 직접 import (상대 경로 사용)
import logoImage from '../../assets/images/logo.png';

// 조원 이미지를 import - 필요한 이미지 파일 경로로 수정해야 합니다
import team1Image from '../../assets/images/team/team1.jpg'; // 박준호
import team2Image from '../../assets/images/team/team2.jpg'; // 유정우
import team3Image from '../../assets/images/team/team5.jpg'; // 임호진
import team4Image from '../../assets/images/team/team4.jpg'; // 김태빈
import team5Image from '../../assets/images/team/team3.jpg'; // 이찬영
import team6Image from '../../assets/images/team/team6.jpg'; // 추교상

const TeamIntroPage: React.FC = () => {
  const navigate = useNavigate();

  // 팀원 데이터
  const teamMembers = [
    { 
      id: 1, 
      name: '박준호', 
      role: '팀장', 
      image: team1Image,
      description: '프로젝트 총괄 및 백엔드 개발'
    },
    { 
      id: 2, 
      name: '유정우', 
      role: '팀원', 
      image: team2Image,
      description: '프론트엔드 개발 및 UI/UX 디자인'
    },
    { 
      id: 3, 
      name: '임호진', 
      role: '팀원', 
      image: team3Image,
      description: '백엔드 개발 및 데이터베이스 설계'
    },
    { 
      id: 4, 
      name: '김태빈', 
      role: '팀원', 
      image: team4Image,
      description: 'AI 모델 개발 및 영상 처리'
    },
    { 
      id: 5, 
      name: '이찬영', 
      role: '팀원', 
      image: team5Image,
      description: '프론트엔드 개발 및 데이터 시각화'
    },
    { 
      id: 6, 
      name: '추교상', 
      role: '팀원', 
      image: team6Image,
      description: '인프라 설계 및 배포 관리'
    }
  ];

  return (
    <div className="team-intro-container">
      {/* Header */}
      <header className="team-intro-header">
        <div className="logo-container" onClick={() => navigate('/')}>
          <img src={logoImage} alt="StrokeCare+ Logo" className="logo" />
          <h1 className="logo-text">StrokeCare+</h1>
        </div>
        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/system">시스템소개</a>
            </li>
            <li className="nav-item">
              <a href="/team" className="active">의료진소개</a>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <button className="login-button" onClick={() => navigate('/login')}>로그인</button>
          <button className="join-button" onClick={() => navigate('/signup')}>회원가입</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="team-intro-main">
        <div className="intro-header">
          <div className="intro-title-container">
            <h1 className="intro-number">02</h1>
            <h2 className="intro-title">스트로크케어 개발팀</h2>
          </div>
          <div className="intro-subtitle">
            <h3>미래융합교육원 3조</h3>
          </div>
        </div>

        <section className="team-overview">
          <div className="overview-content">
            <h3>팀 소개</h3>
            <p>
              StrokeCare+ 개발팀은 환자 중심 의료 시스템 구축을 목표로 다양한 기술 스택을 활용하여 
              혁신적인 임상결정지원시스템(CDSS)을 개발했습니다. 팀원들의 다양한 전문성을 바탕으로 
              프론트엔드, 백엔드, AI 모델링, 데이터 통합 등 전 영역에서 균형 잡힌 개발을 진행했습니다.
            </p>
          </div>
        </section>

        <section className="team-members-section">
          <h3 className="section-title">팀원 소개</h3>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-member-card">
                <div className="member-header">
                  <div className="member-image-container">
                    <img src={member.image} alt={member.name} className="member-image" />
                  </div>
                  <div className="member-info">
                    <h4 className="member-name">{member.name}</h4>
                    <p className="member-role">{member.role}</p>
                  </div>
                </div>
                <div className="member-description">
                  <p>{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="team-vision">
          <div className="vision-content">
            <h3>개발 철학</h3>
            <p>
              저희 팀은 기술이 의료 현장에서 실질적인 가치를 창출할 수 있어야 한다고 믿습니다. 
              뇌졸중과 같은 시간이 중요한 질환에서 의료진의 신속하고 정확한 의사결정을 지원하고, 
              환자에게는 투명하고 이해하기 쉬운 정보를 제공하는 것이 StrokeCare+의 핵심 가치입니다.
            </p>
            <p>
              사용자 중심 설계, 데이터 보안, 시스템 안정성을 최우선으로 고려하며 지속적인 개선과 
              혁신을 통해 의료 환경에 실질적인 변화를 가져오기 위해 노력하고 있습니다.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="team-intro-footer">
        <p>&copy; 2025 StrokeCare+ All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default TeamIntroPage;