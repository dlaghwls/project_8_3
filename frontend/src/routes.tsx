import { Routes, Route, Navigate } from 'react-router-dom';
import NurseDashboard from './pages/NurseDashboard';
import VitalInput from './pages/VitalInput';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/nurse" />} />
      <Route path="/nurse" element={<NurseDashboard />} />
      <Route path="/vital/:patientId" element={<VitalInput />} />
    </Routes>
  );
};

export default AppRoutes;
