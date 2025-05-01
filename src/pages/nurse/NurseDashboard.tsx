import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 40px 20px;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #3f51b5;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #303f9f;
  }
`;

const Toast = styled.div`
  margin-top: 20px;
  background-color: #dff0d8;
  color: #3c763d;
  padding: 12px 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NurseDashboard = () => {
  const [formData, setFormData] = useState({ name: '', gender: '', age: '' });
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/patients/', formData);
      const patientId = res.data.patient_id;

      setFormData({ name: '', gender: '', age: '' });
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        navigate(`/vital/${patientId}`);
      }, 1500);
    } catch (err) {
      console.error('등록 실패:', err);
      alert('등록 중 오류 발생');
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title>StrokeCare 환자 등록 시스템</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>이름</Label>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>성별</Label>
            <Select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">선택</option>
              <option value="male">남자</option>
              <option value="female">여자</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>나이</Label>
            <Input type="number" name="age" value={formData.age} onChange={handleChange} required />
          </FormGroup>
          <Button type="submit">등록</Button>
        </form>

        {showToast && (
          <Toast>
            ✅ 환자 등록 완료! 잠시 후 바이탈 입력으로 이동합니다...
          </Toast>
        )}
      </Container>
    </Wrapper>
  );
};

export default NurseDashboard;