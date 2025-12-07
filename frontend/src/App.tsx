import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDemographics from "./pages/StudentDemographics";
import ManagerDemographics from "./pages/ManagerDemographics";
import HostelDashboard from "./pages/HostelDashboard";
import AddHostel from "./pages/AddHostel";
import AddRoom from "./pages/AddRoom";
import Profile from "./pages/Profile";
import ManagerAnalytics from "./pages/ManagerAnalytics";

localStorage.clear();

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/manager/dashboard" element={<HostelDashboard />} />
        <Route path="/manager/add_hostel" element={<AddHostel />} />
        <Route path="/manager/add_room" element={<AddRoom />} />
        <Route path="/manager/profile" element={<Profile />} />
        <Route path="/manager/analytics" element={<ManagerAnalytics />} />
        <Route path="/student/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="/admin/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/studentdemographics" element={<StudentDemographics />} />
        <Route path="/managerdemographics" element={<ManagerDemographics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;