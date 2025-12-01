import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDemographics from "./pages/StudentDemographics";
import ManagerDemographics from "./pages/ManagerDemographics";

localStorage.clear();

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/manager/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/studentdemographics" element={<StudentDemographics />} />
        <Route path="/managerdemographics" element={<ManagerDemographics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;