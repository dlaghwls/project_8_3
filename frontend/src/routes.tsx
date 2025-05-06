import { Routes, Route, Navigate } from 'react-router-dom';
import NurseDashboard from './pages/nurse/NurseDashboard';
import VitalInput from './pages/nurse/VitalInput';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/nurse" />} />
      <Route path="/nurse" element={<NurseDashboard />} />
    </Routes>
  );
};

export default AppRoutes;