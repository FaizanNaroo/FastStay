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
