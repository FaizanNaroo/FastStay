import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from './pages/admin_dashboard';
import ViewHostels from './pages/admin_hostels';
import ViewStudents from './pages/admin_student';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/hostels" element={<ViewHostels />} />
        <Route path="/students" element={<ViewStudents />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;