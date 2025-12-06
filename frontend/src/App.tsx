import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentProfile from "./pages/Student_Profile";
import EditProfile from "./pages/Edit_Profile";
import Suggestions from "./pages/Suggestions";
import StudentHome from "./pages/Student_Home";
import HostelDetails from "./pages/Hostel_Details";

localStorage.clear();

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/profile/edit" element={<EditProfile />} />
        <Route path="/student/suggestions" element={<Suggestions />} />
        <Route path="/student/home" element={<StudentHome />} />
        <Route path="/student/hostelDetails" element={<HostelDetails/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;