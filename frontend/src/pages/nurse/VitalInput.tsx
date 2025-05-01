import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface VitalForm {
  sbp: string;
  dbp: string;
  hr: string;
  rr: string;
  temperature: string;
  spo2: string;
}

const VitalInput: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [form, setForm] = useState<VitalForm>({
    sbp: '',
    dbp: '',
    hr: '',
    rr: '',
    temperature: '',
    spo2: ''
  });
  const [danger, setDanger] = useState<'normal' | 'warning' | 'danger'>('normal');

  // 수치 변동에 따라 경고 레벨 계산
  useEffect(() => {
    const { sbp, dbp, hr, rr, temperature, spo2 } = form;
    let level: typeof danger = 'normal';

    if (
      Number(sbp) < 90 || Number(sbp) > 180 ||
      Number(dbp) < 60 || Number(dbp) > 120 ||
      Number(hr) < 50 || Number(hr) > 120 ||
      Number(rr) < 10 || Number(rr) > 25 ||
      Number(temperature) < 35.5 || Number(temperature) > 38 ||
      Number(spo2) < 93
    ) {
      level = 'danger';
    } else if (
      Number(sbp) < 100 || Number(sbp) > 160 ||
      Number(hr) < 60 || Number(hr) > 110 ||
      Number(temperature) < 36.0 || Number(temperature) > 37.5
    ) {
      level = 'warning';
    }

    setDanger(level);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) {
      alert('잘못된 환자 ID입니다.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        patient: Number(patientId),         // 실제 PK(id) 사용
        systolic_bp: Number(form.sbp),
        diastolic_bp: Number(form.dbp),
        pulse: Number(form.hr),
        respiration_rate: Number(form.rr),
        temperature: Number(form.temperature),
        oxygen: Number(form.spo2),
      };
      await axios.post(
        'http://localhost:8000/api/vitals/',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('바이탈 정보 저장 완료');
      setForm({ sbp:'', dbp:'', hr:'', rr:'', temperature:'', spo2:'' });
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert('저장 실패: ' + JSON.stringify(err.response?.data));
    }
  };

  const renderMessage = () => {
    if (danger === 'danger')    return <p style={{ color:'red' }}>🔴 위기 상태! 즉시 확인 필요</p>;
    if (danger === 'warning')   return <p style={{ color:'orange' }}>🟠 주의: 일부 수치 경계</p>;
    return <p style={{ color:'green' }}>🟢 정상 범위입니다</p>;
  };

  return (
    <div style={{ padding:'40px', maxWidth:600, margin:'auto' }}>
      <h2>바이탈 입력 (환자 ID: {patientId})</h2>
      <form onSubmit={handleSubmit}>
        <div><label>SBP:</label><input type="number" name="sbp" value={form.sbp} onChange={handleChange} /></div>
        <div><label>DBP:</label><input type="number" name="dbp" value={form.dbp} onChange={handleChange} /></div>
        <div><label>HR:</label><input type="number" name="hr" value={form.hr} onChange={handleChange} /></div>
        <div><label>RR:</label><input type="number" name="rr" value={form.rr} onChange={handleChange} /></div>
        <div><label>체온(°C):</label><input type="number" step="0.1" name="temperature" value={form.temperature} onChange={handleChange} /></div>
        <div><label>SpO₂(%):</label><input type="number" name="spo2" value={form.spo2} onChange={handleChange} /></div>

        <div style={{ margin:'20px 0' }}>{renderMessage()}</div>
        <button type="submit" style={{ padding:'10px 20px' }}>저장</button>
      </form>
    </div>
  );
};

export default VitalInput;