import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VitalInput = () => {
  const { patientId } = useParams();

  const [vitals, setVitals] = useState({
    sbp: '', dbp: '', hr: '', rr: '', temperature: '', spo2: '', comment: ''
  });
  const [dangerLevel, setDangerLevel] = useState<'normal' | 'warning' | 'danger'>('normal');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVitals(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const { sbp, dbp, hr, rr, temperature, spo2 } = vitals;

    let danger = 'normal';
    if (
      Number(sbp) < 90 || Number(sbp) > 180 ||
      Number(dbp) < 60 || Number(dbp) > 120 ||
      Number(hr) < 50 || Number(hr) > 120 ||
      Number(rr) < 10 || Number(rr) > 25 ||
      Number(temperature) < 35.5 || Number(temperature) > 38 ||
      Number(spo2) < 93
    ) {
      danger = 'danger';
    } else if (
      Number(sbp) < 100 || Number(sbp) > 160 ||
      Number(hr) < 60 || Number(hr) > 110 ||
      Number(temperature) < 36.0 || Number(temperature) > 37.5
    ) {
      danger = 'warning';
    }

    setDangerLevel(danger as 'normal' | 'warning' | 'danger');
  }, [vitals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      patient: Number(patientId),
      systolic_bp: vitals.sbp,
      diastolic_bp: vitals.dbp,
      pulse: vitals.hr,
      respiration_rate: vitals.rr,
      temperature: vitals.temperature,
      oxygen: vitals.spo2,
      comment: vitals.comment
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/vitals/', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('바이탈 정보 저장 완료');
      setVitals({ sbp: '', dbp: '', hr: '', rr: '', temperature: '', spo2: '', comment: '' });
    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장 중 오류 발생');
    }
  };

  const renderDangerMessage = () => {
    switch (dangerLevel) {
      case 'danger': return <div style={{ color: 'red', fontWeight: 'bold' }}>🔴 위기 상태! 즉시 확인 필요</div>;
      case 'warning': return <div style={{ color: 'orange', fontWeight: 'bold' }}>🟠 주의: 일부 수치 경계</div>;
      case 'normal': return <div style={{ color: 'green' }}>🟢 정상 범위입니다</div>;
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>바이탈 입력 (환자 ID: {patientId})</h2>
      <form onSubmit={handleSubmit}>
        <div><label>SBP:</label><input type="number" name="sbp" value={vitals.sbp} onChange={handleChange} /></div>
        <div><label>DBP:</label><input type="number" name="dbp" value={vitals.dbp} onChange={handleChange} /></div>
        <div><label>HR:</label><input type="number" name="hr" value={vitals.hr} onChange={handleChange} /></div>
        <div><label>RR:</label><input type="number" name="rr" value={vitals.rr} onChange={handleChange} /></div>
        <div><label>체온(°C):</label><input type="number" name="temperature" step="0.1" value={vitals.temperature} onChange={handleChange} /></div>
        <div><label>SpO2(%):</label><input type="number" name="spo2" value={vitals.spo2} onChange={handleChange} /></div>
        <div><label>Comment:</label><textarea name="comment" value={vitals.comment} onChange={handleChange} /></div>

        <div style={{ marginTop: '15px' }}>{renderDangerMessage()}</div>

        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px' }}>저장</button>
      </form>
    </div>
  );
};

export default VitalInput;
