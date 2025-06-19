import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login.js';
import Upload from './pages/upload.js';
import Chart from './pages/chart.js';
import Dashboard from './pages/dashboard.js';
import AdminPanel from './pages/admin.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login.js" element={<Login />} />
        <Route path="/upload.js" element={<Upload />} />
        <Route path="/chart.js" element={<Chart />} />
        <Route path="/dashboard.js" element={<Dashboard />} />
        <Route path="/admin.js" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;