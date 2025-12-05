import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from './pages/admin_dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;