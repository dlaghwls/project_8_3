import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VitalInput = () => {
  const { patientId } = useParams();
  const [formData, setFormData] = useState({
    sbp: '',
    dbp: '',
    hr: '',
    rr: '',
    temp: '',
    spo2: '',
    comment: '',
  });

  const [dangerLevel, setDangerLevel] = useState<'normal' | 'warning' | 'danger'>('normal');

  useEffect(() => {
    const { sbp, dbp, hr, rr, temp, spo2 } = formData;
    if (!sbp || !dbp || !hr || !rr || !temp || !spo2) return;

    const s = parseInt(sbp);
    const d = parseInt(dbp);
    const h = parseInt(hr);
    const r = parseInt(rr);
    const t = parseFloat(temp);
    const o = parseFloat(spo2);

    let danger = false;
    let warning = false;

    if (s > 180 || d > 120 || h < 40 || h > 150 || r < 10 || r > 30 || t < 35 || t > 39 || o < 90) danger = true;
    else if (s > 140 || d > 90 || h < 50 || h > 120 || r < 12 || r > 24 || t < 36 || t > 38 || o < 95) warning = true;

    if (danger) setDangerLevel('danger');
    else if (warning) setDangerLevel('warning');
    else setDangerLevel('normal');
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        patient: patientId,
        systolic_bp: Number(formData.sbp),
        diastolic_bp: Number(formData.dbp),
        pulse: Number(formData.hr),
        respiration_rate: Number(formData.rr),
        temperature: Number(formData.temp),
        oxygen: Number(formData.spo2),
        comment: formData.comment,
      };

      await axios.post('http://localhost:8000/api/vitals/', payload);
      alert('바이탈 등록 완료');

      if (dangerLevel === 'danger') {
        const res = await axios.get('http://localhost:8000/api/users/?role=doctor');
        const doctors = res.data;

        for (const doctor of doctors) {
          await axios.post('http://localhost:8000/api/messages/', {
            sender: null, // 시스템 메시지로 가정
            receiver: doctor.id,
            content: `환자 ${patientId}의 바이탈 수치가 위험 수준입니다.`,
          });
        }
        alert('위험도 알림이 의사에게 전송되었습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('등록 실패');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>바이탈 입력</h2>
      <form onSubmit={handleSubmit}>
        <div><label>수축기 혈압(SBP): </label><input type="number" name="sbp" value={formData.sbp} onChange={handleChange} required /></div>
        <div><label>이완기 혈압(DBP): </label><input type="number" name="dbp" value={formData.dbp} onChange={handleChange} required /></div>
        <div><label>심박수(HR): </label><input type="number" name="hr" value={formData.hr} onChange={handleChange} required /></div>
        <div><label>호흡수(RR): </label><input type="number" name="rr" value={formData.rr} onChange={handleChange} required /></div>
        <div><label>체온(℃): </label><input type="number" name="temp" step="0.1" value={formData.temp} onChange={handleChange} required /></div>
        <div><label>산소포화도(SpO₂): </label><input type="number" name="spo2" step="0.1" value={formData.spo2} onChange={handleChange} required /></div>
        <div><label>Comment: </label><textarea name="comment" value={formData.comment} onChange={handleChange} /></div>
        <button type="submit">등록</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        {dangerLevel === 'danger' && <p style={{ color: 'red' }}>위험도: 🔴 높음 – 즉시 확인 필요</p>}
        {dangerLevel === 'warning' && <p style={{ color: 'orange' }}>위험도: 🟠 주의 – 경계 수치</p>}
        {dangerLevel === 'normal' && <p style={{ color: 'green' }}>위험도: 🟢 정상</p>}
      </div>
    </div>
  );
};

export default VitalInput;
