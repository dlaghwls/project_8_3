// src/pages/landing/LandingPage.tsx

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

// 로고 이미지 직접 import (상대 경로 사용)
import logoImage from '../../assets/images/logo.png';
// 다른 이미지들도 직접 import
import heroImage from '../../assets/images/hero-bg.jpg';
import serviceIcon1 from '../../assets/images/service-icon1.png';
import serviceIcon2 from '../../assets/images/service-icon2.png';
import serviceIcon3 from '../../assets/images/service-icon3.png';
import serviceIcon4 from '../../assets/images/service-icon4.png';
import doctorImage from '../../assets/images/doctor.png';
import gallery1Image from '../../assets/images/gallery1.jpg';
import gallery2Image from '../../assets/images/gallery2.jpg';
import locationImage from '../../assets/images/location-icon.png';

const LandingPage = () => {
  const navigate = useNavigate();
  
  // 섹션 참조 생성
  const systemSectionRef = useRef<HTMLDivElement>(null);
  const doctorsSectionRef = useRef<HTMLDivElement>(null);
  
  // 활성 섹션 상태
  const [activeSection, setActiveSection] = useState<string>('');

  // 스크롤 이벤트 처리 함수
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 100; // 약간의 오프셋 추가
    
    // 각 섹션의 위치 확인
    const systemSection = systemSectionRef.current?.offsetTop || 0;
    const doctorsSection = doctorsSectionRef.current?.offsetTop || 0;
    
    // 활성 섹션 결정
    if (scrollPosition >= doctorsSection) {
      setActiveSection('doctors');
    } else if (scrollPosition >= systemSection) {
      setActiveSection('system');
    } else {
      setActiveSection('');
    }
  };

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 네비게이션 링크 클릭 처리 함수
  const scrollToSection = (sectionId: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    
    const sectionRef = 
      sectionId === 'system' ? systemSectionRef.current :
      sectionId === 'doctors' ? doctorsSectionRef.current : null;
    
    if (sectionRef) {
      window.scrollTo({
        top: sectionRef.offsetTop - 80, // 헤더 높이만큼 오프셋 적용
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="logo-container">
          <img src={logoImage} alt="StrokeCare+ Logo" className="logo" />
          <h1 className="logo-text">StrokeCare+</h1>
        </div>
        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <a 
                href="/system" 
                className={activeSection === 'system' ? 'active' : ''}
              >
                시스템소개
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="/team" 
                className={activeSection === 'doctors' ? 'active' : ''}
              >
                의료진소개
              </a>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <button className="login-button" onClick={() => navigate('/login')}>로그인</button>
          <button className="join-button" onClick={() => navigate('/signup')}>회원가입</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        {/* Hero Section */}
        <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="hero-content">
            <p className="tagline">Stroke is very very dangerous</p>
            <h2 className="hero-title">방심하다 <span className="highlight">한번</span>에<br />훅 갑니다</h2>
          </div>
          {/* Slide dots */}
          <div className="slide-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </section>

        {/* Grid Layout */}
        <div className="content-grid">
          {/* Services Section */}
          <section className="medical-services" ref={systemSectionRef} id="system">
            <div className="services-grid">
              <div className="service-item">
                <img src={serviceIcon1} alt="CT 영상분석" />
                <p>CT 영상 분석</p>
              </div>
              <div className="service-item">
                <img src={serviceIcon2} alt="실시간 모니터링" />
                <p>실시간 모니터링</p>
              </div>
              <div className="service-item">
                <img src={serviceIcon3} alt="위험도 예측" />
                <p>위험도 예측</p>
              </div>
              <div className="service-item">
                <img src={serviceIcon4} alt="치료 가이드라인" />
                <p>치료가이드라인</p>
              </div>
            </div>
            <div className="consult-button-container">
              <button className="consult-button" onClick={() => navigate('/consultation')}>진료문의하기</button>
            </div>
          </section>

          {/* System Introduction */}
          <section className="doctor-intro" ref={doctorsSectionRef} id="doctors">
            <h3 className="section-title">시스템소개</h3>
            <div className="doctor-content">
              <div className="doctor-info">
                <p>경험과 실력을<br />바탕으로 표준화된<br />의료 CDSS 시스템<br />StrokeCare+ 입니다.</p>
                <p className="doctor-name">3조 <span className="doctor-name-value">미래융합교육원</span></p>
              </div>
              <div className="doctor-image">
                <img src={doctorImage} alt="Doctor" />
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          <section className="gallery-section">
            <div className="gallery-header">
              <h3 className="gallery-title">둘러보기</h3>
              <button className="view-more">VIEW MORE</button>
            </div>
            <div className="gallery-images">
              <img src={gallery1Image} alt="Hospital Interior 1" className="gallery-image" />
              <img src={gallery2Image} alt="Hospital Interior 2" className="gallery-image" />
            </div>
          </section>

          {/* Location Section - 오시는길만 표시 */}
          <section className="location-section">
            <div className="location-map">
              <img src={locationImage} alt="Location" />
              <span className="location-text">오시는길</span>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2025 StrokeCare+ All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;