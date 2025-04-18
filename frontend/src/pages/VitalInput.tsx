import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VitalInput = () => {
  const { patientId } = useParams(); // URL에서 ID 가져오기

  const [vitals, setVitals] = useState({
    sbp: '',
    dbp: '',
    hr: '',
    rr: '',
    temp: '',
    spo2: '',
    comment: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVitals((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      patient_id: patientId,
      ...vitals,
    };

    try {
      await axios.post('http://localhost:8000/api/vitals/', payload);
      alert('바이탈 정보 저장 완료');
      setVitals({ sbp: '', dbp: '', hr: '', rr: '', temp: '', spo2: '', comment: '' });
    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장 중 오류 발생');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>바이탈 정보 입력 (환자 ID: {patientId})</h2>
      <form onSubmit={handleSubmit}>
        <div><label>SBP: </label><input type="number" name="sbp" value={vitals.sbp} onChange={handleChange} /></div>
        <div><label>DBP: </label><input type="number" name="dbp" value={vitals.dbp} onChange={handleChange} /></div>
        <div><label>HR: </label><input type="number" name="hr" value={vitals.hr} onChange={handleChange} /></div>
        <div><label>RR: </label><input type="number" name="rr" value={vitals.rr} onChange={handleChange} /></div>
        <div><label>체온(°C): </label><input type="number" name="temp" step="0.1" value={vitals.temp} onChange={handleChange} /></div>
        <div><label>SpO2(%): </label><input type="number" name="spo2" value={vitals.spo2} onChange={handleChange} /></div>
        <div><label>Comment: </label><textarea name="comment" value={vitals.comment} onChange={handleChange} /></div>
        <button type="submit">저장</button>
      </form>
    </div>
  );
};

export default VitalInput;
