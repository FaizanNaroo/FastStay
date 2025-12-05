// import React, { useState, useEffect } from "react";
// import { getDashboardSummary, getRecentUsersTableData,type RecentUserAccount } from "../api/admin_dashboard";
// import styles from "../styles/admin_dashboard.module.css";

// interface DashboardSummary {
//   total_students: number;
//   total_managers: number;
//   total_hostels: number;
//   total_rooms: number;
// }

// const AdminDashboard: React.FC = () => {
//   const [summary, setSummary] = useState<DashboardSummary | null>(null);
//   const [recentUsers, setRecentUsers] = useState<RecentUserAccount[]>([]); 
  
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch summary data
//         const summaryData = await getDashboardSummary();
//         setSummary(summaryData);

//         // Fetch recent users data (limit to 10 by default as per API function)
//         const usersData = await getRecentUsersTableData(5); // Show 5 recent users
//         setRecentUsers(usersData);

//         setLoading(false);
//       } catch (err: unknown) {
//         console.error("Fetch error:", err);
//         setError("Failed to load dashboard data. Check API endpoint.");
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // --- Loading and Error States ---
//   if (loading) {
//     return (
//       <div className={styles.container} style={{ textAlign: "center", marginTop: "50px" }}>
//         <h2>Loading Dashboard Data...</h2>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className={styles.container}
//         style={{ textAlign: "center", marginTop: "50px", color: "red" }}
//       >
//         <h2>Error: {error}</h2>
//       </div>
//     );
//   }
//   // ---------------------------------

//   return (
//     <>
//       {/* Navbar */}
//       <nav className={styles.navbar}>
//         <div className={styles.logo}>
//           <i className="fa-solid fa-user-shield"></i> FastStay Admin
//         </div>

//         <div className={styles.navLinks}>
//           <a className={styles.active}>Dashboard</a>
//           <a>Hostels</a>
//           <a>Students</a>
//           <a>Managers</a>
//           <a>Logout</a>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className={styles.container}>
//         <h2 className={styles.pageTitle}>Admin Dashboard</h2>
//         <p className={styles.subtitle}>Manage all data throughout the platform.</p>

//         {/* Dashboard Cards */}
//         <div className={styles.cards}>
//           <div className={styles.card}>
//             <i className="fa-solid fa-users"></i>
//             <p className={styles.cardTitle}>Total Students</p>
//             <p className={styles.cardValue}>{summary?.total_students ?? 0}</p>
//           </div>

//           <div className={styles.card}>
//             <i className="fa-solid fa-user-tie"></i>
//             <p className={styles.cardTitle}>Hostel Managers</p>
//             <p className={styles.cardValue}>{summary?.total_managers ?? 0}</p>
//           </div>

//           <div className={styles.card}>
//             <i className="fa-solid fa-hotel"></i>
//             <p className={styles.cardTitle}>Hostels Listed</p>
//             <p className={styles.cardValue}>{summary?.total_hostels ?? 0}</p>
//           </div>

//           <div className={styles.card}>
//             <i className="fa-solid fa-bed"></i>
//             <p className={styles.cardTitle}>Rooms</p>
//             <p className={styles.cardValue}>{summary?.total_rooms ?? 0}</p>
//           </div>
//         </div>
        
//         {/* --- Recent User Accounts Table --- */}
//         <div className={styles.tableCard}>
//           <p className={styles.tableTitle}>
//             <i className="fa-solid fa-user-plus"></i> Recent User Accounts
//           </p>

//           <table className={styles.userTable}>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>City</th>
//                 <th>User Type</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentUsers.length > 0 ? (
//                 recentUsers.map((user) => (
//                   <tr key={user.userid}>
//                     <td>{user.Name}</td>
//                     <td>{user.City}</td>
//                     <td>{user.UserType}</td>
//                     <td>
//                       {/* You would implement navigation or a modal here */}
//                       <button 
//                         className={styles.actionBtn}
//                         onClick={() => console.log(`View user ${user.userid}`)}
//                       >
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={4} style={{ textAlign: "center", color: "#6d5d52" }}>
//                     No recent users found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//         {/* ---------------------------------- */}
        
//         {/* Note: The second table (Recent Hostels) is not implemented as the API function was not provided. */}
//         <p>Other recent tables (e.g., Recently Added Hostels) will be integrated here with corresponding API functions.</p>
//       </div>
//     </>
//   );
// };







import React, { useState, useEffect } from "react";
import { 
  getDashboardSummary, 
  getRecentUsersTableData, 
  type RecentUserAccount 
} from "../api/admin_dashboard";

import { getRecentHostelsTableData, type RecentHostel } from "../api/admin_dashboard"; // <-- imported hostel API

import styles from "../styles/admin_dashboard.module.css";

// Dashboard Summary
interface DashboardSummary {
  total_students: number;
  total_managers: number;
  total_hostels: number;
  total_rooms: number;
}

const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUserAccount[]>([]);
  
  const [recentHostels, setRecentHostels] = useState<RecentHostel[]>([]);   // <-- added for hostel list
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await getDashboardSummary();
        setSummary(summaryData);

        const usersData = await getRecentUsersTableData(5);
        setRecentUsers(usersData);

        const hostelData = await getRecentHostelsTableData(5);     // <-- fetch 5 latest hostels
        setRecentHostels(hostelData);

        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? `Failed to load dashboard data: ${err.message}`
          : "Failed to load dashboard data. Check backend connection.";
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <h2 style={{ textAlign:"center", marginTop:"40px" }}>Loading Dashboard...</h2>;
  if (error)   return <h2 style={{ textAlign:"center", marginTop:"40px", color:"red" }}>{error}</h2>;

  return (
    <>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}><i className="fa-solid fa-user-shield"></i> FastStay Admin</div>

        <div className={styles.navLinks}>
          <a className={styles.active}>Dashboard</a>
          <a>Hostels</a>
          <a>Students</a>
          <a>Managers</a>
          <a>Logout</a>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>Admin Dashboard</h2>
        <p className={styles.subtitle}>Manage all data throughout the platform.</p>

        {/* DASHBOARD STATS CARDS */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <i className="fa-solid fa-users"></i>
            <p className={styles.cardTitle}>Total Students</p>
            <p className={styles.cardValue}>{summary?.total_students}</p>
          </div>
          
          <div className={styles.card}>
            <i className="fa-solid fa-user-tie"></i>
            <p className={styles.cardTitle}>Hostel Managers</p>
            <p className={styles.cardValue}>{summary?.total_managers}</p>
          </div>

          <div className={styles.card}>
            <i className="fa-solid fa-hotel"></i>
            <p className={styles.cardTitle}>Hostels Listed</p>
            <p className={styles.cardValue}>{summary?.total_hostels}</p>
          </div>

          <div className={styles.card}>
            <i className="fa-solid fa-bed"></i>
            <p className={styles.cardTitle}>Rooms</p>
            <p className={styles.cardValue}>{summary?.total_rooms}</p>
          </div>
        </div>


        {/* RECENT STUDENTS */}
        <div className={styles.tableCard}>
          <p className={styles.tableTitle}><i className="fa-solid fa-user-plus"></i> Recent User Accounts</p>
          
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>User Type</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {recentUsers.length > 0 ? (
                recentUsers.map(u => (
                  <tr key={u.userid}>
                    <td>{u.Name}</td>
                    <td>{u.City}</td>
                    <td>{u.UserType}</td>
                    <td><button className={styles.actionBtn}>View</button></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} style={{ textAlign:"center" }}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>



        {/* -------------------- RECENT HOSTELS TABLE -------------------- */}
        <div className={styles.tableCard}>
          <p className={styles.tableTitle}><i className="fa-solid fa-building"></i> Recently Added Hostels</p>

          <table>
            <thead>
              <tr>
                <th>Hostel Name</th>
                <th>House No</th>
                <th>Manager</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {recentHostels.length > 0 ? (
                recentHostels.map(h => (
                  <tr key={h.hostelId}>
                    <td>{h.hostelName}</td>
                    <td>{h.houseNo}</td>
                    <td>{h.managerName}</td>
                    <td>
                      <button 
                        className={styles.actionBtn}
                        onClick={()=>console.log("Open Hostel ->",h.hostelId)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign:"center" }}>No Hostels Found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;
