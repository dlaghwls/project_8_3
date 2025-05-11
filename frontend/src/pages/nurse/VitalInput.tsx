// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../../services/api';

// // 타입 정의
// type VitalState = {
//   sbp: number | null;
//   dbp: number | null;
//   hr: number | null;
//   rr: number | null;
//   temperature: number | null;
//   spo2: number | null;
//   comment: string;
// };

// const VitalInput: React.FC = () => {
//   const { patientId } = useParams<{ patientId: string }>();
//   const navigate = useNavigate();  

//   // 초기값을 null로 설정
//   const [vitals, setVitals] = useState<VitalState>({
//     sbp: null,
//     dbp: null,
//     hr: null,
//     rr: null,
//     temperature: null,
//     spo2: null,
//     comment: ''
//   });

//   const [dangerLevel, setDangerLevel] = useState<'normal' | 'warning' | 'danger'>('normal');

//   // 입력값 처리 함수
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setVitals(prev => ({
//       ...prev,
//       [name]: value === '' ? null : Number(value)
//     }));
//   };

//   // 위험도 계산 로직
//   useEffect(() => {
//     const { sbp, dbp, hr, rr, temperature, spo2 } = vitals;
    
//     // 모든 필드가 유효한 숫자인지 확인
//     const isValid = [sbp, dbp, hr, rr, temperature, spo2].every(
//       val => val !== null && !isNaN(val)
//     );

//     if (!isValid) {
//       setDangerLevel('normal');
//       return;
//     }

//     // 실제 계산 로직
//     let level: 'normal'|'warning'|'danger' = 'normal';
    
//     if (
//       (sbp! < 90 || sbp! > 180) ||
//       (dbp! < 60 || dbp! > 120) ||
//       (hr! < 50 || hr! > 120) ||
//       (temperature! < 35.5 || temperature! > 38) ||
//       (spo2! < 93)
//     ) {
//       level = 'danger';
//     } else if (
//       (sbp! < 100 || sbp! > 160) ||
//       (hr! < 60 || hr! > 110) ||
//       (temperature! < 36.0 || temperature! > 37.5)
//     ) {
//       level = 'warning';
//     }

//     setDangerLevel(level);
//   }, [vitals]);

//   // 폼 제출 처리
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // null 값 체크
//     if (Object.values(vitals).some(val => 
//       val === null && typeof val !== 'string'
//     )) {
//       alert('모든 수치를 입력해주세요');
//       return;
//     }

//     const payload = {
//       patient: Number(patientId),
//       systolic_bp: vitals.sbp!,
//       diastolic_bp: vitals.dbp!,
//       pulse: vitals.hr!,
//       respiration_rate: vitals.rr!,
//       temperature: vitals.temperature!,
//       oxygen: vitals.spo2!,
//       comment: vitals.comment
//     };

//     try {
//       await api.post('/vitals/', payload);
//       alert('바이탈 정보 저장 완료');
//       setVitals({
//         sbp: null,
//         dbp: null,
//         hr: null,
//         rr: null,
//         temperature: null,
//         spo2: null,
//         comment: ''
//       });
//       navigate('/nurse');
//     } catch (err: any) {
//       console.error('저장 실패:', err);
//       alert('저장 중 오류 발생');
//     }
//   };

//   // 위험 메시지 렌더링
//   const renderDangerMessage = () => {
//     switch (dangerLevel) {
//       case 'danger': return <div className="danger">🔴 위기 상태! 즉시 확인 필요</div>;
//       case 'warning': return <div className="warning">🟠 주의: 일부 수치 경계</div>;
//       default: return <div className="normal">🟢 정상 범위입니다</div>;
//     }
//   };

//   // 입력값 포맷팅 (null → 빈 문자열)
//   const formatValue = (value: number | null) => 
//     value === null ? '' : value.toString();

//   return (
//     <div className="vital-container">
//       <h2>바이탈 입력 (환자 ID: {patientId})</h2>
//       <form onSubmit={handleSubmit}>
//         {[
//           { label: 'SBP', name: 'sbp', type: 'number' },
//           { label: 'DBP', name: 'dbp', type: 'number' },
//           { label: 'HR', name: 'hr', type: 'number' },
//           { label: 'RR', name: 'rr', type: 'number' },
//           { label: '체온(°C)', name: 'temperature', type: 'number', step: '0.1' },
//           { label: 'SpO2(%)', name: 'spo2', type: 'number' },
//         ].map(({ label, name, type, step }) => (
//           <div key={name} className="input-group">
//             <label>{label}:</label>
//             <input
//               type={type}
//               name={name}
//               value={formatValue(vitals[name as keyof VitalState] as number | null)}
//               onChange={handleChange}
//               step={step}
//               required
//             />
//           </div>
//         ))}

//         <div className="input-group">
//           <label>Comment:</label>
//           <textarea
//             name="comment"
//             value={vitals.comment}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="danger-message">
//           {renderDangerMessage()}
//         </div>

//         <button type="submit" className="submit-btn">
//           저장
//         </button>
//       </form>
//     </div>
//   );
// };

// export default VitalInput;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

// 타입 정의
type VitalState = {
  sbp: number | null;
  dbp: number | null;
  hr: number | null;
  rr: number | null;
  temperature: number | null;
  spo2: number | null;
  comment: string;
};

// 스타일 객체
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '25px',
    color: '#2c3e50',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    minHeight: '80px',
    resize: 'vertical' as 'vertical',
  },
  dangerMessage: {
    padding: '12px',
    borderRadius: '5px',
    textAlign: 'center' as 'center',
    fontWeight: 'bold',
    marginBottom: '20px',
    marginTop: '20px',
  },
  danger: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
  },
  warning: {
    backgroundColor: '#fff8e1',
    color: '#ff8f00',
  },
  normal: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  submitButton: {
    padding: '12px 20px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#1976d2',
  }
};

const VitalInput: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();  

  // 초기값을 null로 설정
  const [vitals, setVitals] = useState<VitalState>({
    sbp: null,
    dbp: null,
    hr: null,
    rr: null,
    temperature: null,
    spo2: null,
    comment: ''
  });

  const [dangerLevel, setDangerLevel] = useState<'normal' | 'warning' | 'danger'>('normal');
  const [buttonHover, setButtonHover] = useState(false);

  // 입력값 처리 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVitals(prev => ({
      ...prev,
      [name]: name === 'comment' ? value : (value === '' ? null : Number(value))
    }));
  };

  // 위험도 계산 로직
  useEffect(() => {
    const { sbp, dbp, hr, rr, temperature, spo2 } = vitals;
    
    // 모든 필드가 유효한 숫자인지 확인
    const isValid = [sbp, dbp, hr, rr, temperature, spo2].every(
      val => val !== null && !isNaN(Number(val))
    );

    if (!isValid) {
      setDangerLevel('normal');
      return;
    }

    // 실제 계산 로직
    let level: 'normal'|'warning'|'danger' = 'normal';
    
    if (
      (sbp! < 90 || sbp! > 180) ||
      (dbp! < 60 || dbp! > 120) ||
      (hr! < 50 || hr! > 120) ||
      (rr! < 10 || rr! > 25) ||  // RR 범위 추가
      (temperature! < 35.5 || temperature! > 38) ||
      (spo2! < 93)
    ) {
      level = 'danger';
    } else if (
      (sbp! < 100 || sbp! > 160) ||
      (hr! < 60 || hr! > 110) ||
      (temperature! < 36.0 || temperature! > 37.5)
    ) {
      level = 'warning';
    }

    setDangerLevel(level);
  }, [vitals]);

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // null 값 체크
    if (Object.values(vitals).some(val => 
      val === null && typeof val !== 'string'
    )) {
      alert('모든 수치를 입력해주세요');
      return;
    }

    const payload = {
      patient: Number(patientId),
      systolic_bp: vitals.sbp!,
      diastolic_bp: vitals.dbp!,
      pulse: vitals.hr!,
      respiration_rate: vitals.rr!,
      temperature: vitals.temperature!,
      oxygen: vitals.spo2!,
      comment: vitals.comment
    };

    try {
      await api.post('/vitals/', payload);
      alert('바이탈 정보 저장 완료');
      setVitals({
        sbp: null,
        dbp: null,
        hr: null,
        rr: null,
        temperature: null,
        spo2: null,
        comment: ''
      });
      navigate('/nurse');
    } catch (err: any) {
      console.error('저장 실패:', err);
      alert('저장 중 오류 발생');
    }
  };

  // 위험 메시지 렌더링
  const renderDangerMessage = () => {
    let messageStyle = {...styles.dangerMessage};
    
    switch (dangerLevel) {
      case 'danger': 
        messageStyle = {...messageStyle, ...styles.danger};
        return <div style={messageStyle}>🔴 위기 상태! 즉시 확인 필요</div>;
      case 'warning': 
        messageStyle = {...messageStyle, ...styles.warning};
        return <div style={messageStyle}>🟠 주의: 일부 수치 경계</div>;
      default: 
        messageStyle = {...messageStyle, ...styles.normal};
        return <div style={messageStyle}>🟢 정상 범위입니다</div>;
    }
  };

  // 입력값 포맷팅 (null → 빈 문자열)
  const formatValue = (value: number | null) => 
    value === null ? '' : value.toString();

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>바이탈 입력 (환자 ID: {patientId})</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={styles.formGrid}>
          {[
            { label: 'SBP (mmHg)', name: 'sbp', type: 'number' },
            { label: 'DBP (mmHg)', name: 'dbp', type: 'number' },
            { label: 'HR (bpm)', name: 'hr', type: 'number' },
            { label: 'RR (/min)', name: 'rr', type: 'number' },
            { label: '체온 (°C)', name: 'temperature', type: 'number', step: '0.1' },
            { label: 'SpO2 (%)', name: 'spo2', type: 'number' },
          ].map(({ label, name, type, step }) => (
            <div key={name} style={styles.inputGroup}>
              <label style={styles.label}>{label}</label>
              <input
                style={styles.input}
                type={type}
                name={name}
                value={formatValue(vitals[name as keyof VitalState] as number | null)}
                onChange={handleChange}
                step={step}
                required
              />
            </div>
          ))}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Comment</label>
          <textarea
            style={styles.textarea}
            name="comment"
            value={vitals.comment}
            onChange={handleChange}
            placeholder="환자 상태에 대한 메모..."
          />
        </div>

        {renderDangerMessage()}

        <button
          type="submit"
          style={{
            ...styles.submitButton,
            ...(buttonHover ? styles.buttonHover : {})
          }}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          저장
        </button>
      </form>
    </div>
  );
};

export default VitalInput;
