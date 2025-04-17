import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NurseDashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const payload = {
      name: formData.name,
      gender: formData.gender,
      age: formData.age,
    };
  
    try {
      const res = await axios.post('http://localhost:8000/api/patients/', payload);
      const patientId = res.data.patient_id; // 백에서 생성된 ID 받기
      alert('환자 등록 완료');
      setFormData({ name: '', gender: '', age: '' });
      navigate(`/vital/${patientId}`); // 해당 ID로 이동
    } catch (err) {
      console.error('등록 실패:', err);
      alert('등록 중 오류 발생');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>환자 신규 등록</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름: </label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>성별: </label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">선택</option>
            <option value="male">남자</option>
            <option value="female">여자</option>
          </select>
        </div>
        <div>
          <label>나이: </label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </div>
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default NurseDashboard;
