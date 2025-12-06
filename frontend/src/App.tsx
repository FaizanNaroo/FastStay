


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Dashboard Route */}
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="admin/logout" element={<LogoutConfirm />} />
//         {/* Admin Main Pages */}
//         <Route path="/admin/hostels" element={<ViewHostels />} />
//         <Route path="/admin/students" element={<AdminViewStudents />} />
//         <Route path="/admin/managers" element={<AdminViewManagers />} />
        
//         {/* Detail Pages with ID parameters */}
//         <Route path="/admin/hostels/:id" element={<AdminViewHostels />} />
//         <Route path="/admin/managers/:id" element={<AdminManagerProfile />} />
//         <Route path="/admin/students/:id" element={<AdminStudentProfile />} />
        
//         {/* Redirect root to admin dashboard */}
//         <Route path="/" element={<AdminDashboard />} />
        
//         {/* 404 Page */}
//         <Route path="*" element={<h1>404 - Page Not Found</h1>} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from './pages/admin_dashboard';
import AdminViewStudents from './pages/admin_student';
import AdminViewManagers from './pages/admin_manager';
import ViewHostels from './pages/admin_hostels';
import AdminManagerProfile from './pages/admin_manager_review';
import AdminStudentProfile from './pages/admin_students_review';
import AdminViewHostels from './pages/admin_hostels_review';
import LogoutConfirm from './pages/admin_signout';


// Update App.tsx to include the hostel detail route
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard Route */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="admin/logout" element={<LogoutConfirm />} />
        
        {/* Admin Main Pages */}
        <Route path="/admin/hostels" element={<ViewHostels />} />
        <Route path="/admin/students" element={<AdminViewStudents />} />
        <Route path="/admin/managers" element={<AdminViewManagers />} />
        
        {/* Detail Pages with ID parameters */}
        <Route path="/admin/hostels/:id" element={<AdminViewHostels />} />
        {/* OR if using separate component: */}
        {/* <Route path="/admin/hostels/:id" element={<HostelDetail />} /> */}
        
        <Route path="/admin/managers/:id" element={<AdminManagerProfile />} />
        <Route path="/admin/students/:id" element={<AdminStudentProfile />} />
        
        {/* Redirect root to admin dashboard */}
        <Route path="/" element={<AdminDashboard />} />
        
        {/* 404 Page */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


