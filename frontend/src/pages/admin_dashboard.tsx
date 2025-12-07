
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { 
  getDashboardSummary, 
  getRecentUsersTableData, 
  type RecentUserAccount 
} from "../api/admin_dashboard";

import { getRecentHostelsTableData, type RecentHostel } from "../api/admin_dashboard";

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
  const [recentHostels, setRecentHostels] = useState<RecentHostel[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  
  // Individual loading states
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [hostelsLoading, setHostelsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set individual loading states
        setSummaryLoading(true);
        setUsersLoading(true);
        setHostelsLoading(true);
        
        // Fetch all data in parallel
        const [summaryData, usersData, hostelData] = await Promise.all([
          getDashboardSummary(),
          getRecentUsersTableData(5),
          getRecentHostelsTableData(5)
        ]);
        
        setSummary(summaryData);
        setSummaryLoading(false);
        
        setRecentUsers(usersData);
        setUsersLoading(false);
        
        setRecentHostels(hostelData);
        setHostelsLoading(false);
        
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? `Failed to load dashboard data: ${err.message}`
          : "Failed to load dashboard data. Check backend connection.";
        setError(errorMessage);
        
        // Set all loading states to false on error
        setSummaryLoading(false);
        setUsersLoading(false);
        setHostelsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) return <h2 style={{ textAlign:"center", marginTop:"40px", color:"red" }}>{error}</h2>;

  // Helper function to determine profile route based on user type
  const getUserProfileRoute = (user: RecentUserAccount) => {
    switch (user.UserType) {
      case "Hostel Manager":
        return `/admin/managers/${user.userid}`;
      case "Student":
        return `/admin/students/${user.userid}`;
      default:
        return "#";
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}><i className="fa-solid fa-user-shield"></i> FastStay Admin</div>

        <div className={styles.navLinks}>
          <Link to="/admin" className={styles.active}>Dashboard</Link>
          <Link to="/admin/hostels">Hostels</Link>
          <Link to="/admin/students">Students</Link>
          <Link to="/admin/managers">Managers</Link>
          <Link to="/admin/logout">Logout</Link>
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
            <p className={styles.cardValue}>
              {summaryLoading ? "Loading..." : (summary?.total_students || "0")}
            </p>
          </div>
          
          <div className={styles.card}>
            <i className="fa-solid fa-user-tie"></i>
            <p className={styles.cardTitle}>Hostel Managers</p>
            <p className={styles.cardValue}>
              {summaryLoading ? "Loading..." : (summary?.total_managers || "0")}
            </p>
          </div>

          <div className={styles.card}>
            <i className="fa-solid fa-hotel"></i>
            <p className={styles.cardTitle}>Hostels Listed</p>
            <p className={styles.cardValue}>
              {summaryLoading ? "Loading..." : (summary?.total_hostels || "0")}
            </p>
          </div>

          <div className={styles.card}>
            <i className="fa-solid fa-bed"></i>
            <p className={styles.cardTitle}>Rooms</p>
            <p className={styles.cardValue}>
              {summaryLoading ? "Loading..." : (summary?.total_rooms || "0")}
            </p>
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
              {usersLoading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign:"center", padding: "20px" }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                    Loading users...
                  </td>
                </tr>
              ) : recentUsers.length > 0 ? (
                recentUsers.map(u => (
                  <tr key={u.userid}>
                    <td>{u.Name}</td>
                    <td>{u.City}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: u.UserType === 'Student' ? '#7D5D4E' :      // Muted Brown
                                          u.UserType === 'Hostel Manager' ? '#8B7355' : '#A1887F', // Muted Tan & Muted Gray-Brown
                          color: '#F8F3E7',  // Cream text
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          {u.UserType}
                        </span>
                      </td>
                    <td>
                      {u.UserType === "Student" || u.UserType === "Hostel Manager" ? (
                        <Link 
                          to={getUserProfileRoute(u)}
                          className={styles.actionBtn}
                          style={{
                            display: 'inline-block',
                            padding: '8px 16px',
                            textDecoration: 'none',
                            textAlign: 'center'
                          }}
                        >
                          View
                        </Link>
                      ) : (
                        <button 
                          className={styles.actionBtn}
                          disabled
                          title="Profile not available for this user type"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign:"center", padding: "20px" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* RECENT HOSTELS TABLE */}
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
              {hostelsLoading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign:"center", padding: "20px" }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                    Loading hostels...
                  </td>
                </tr>
              ) : recentHostels.length > 0 ? (
                recentHostels.map(h => (
                  <tr key={h.hostelId}>
                    <td>{h.hostelName}</td>
                    <td>{h.houseNo}</td>
                    <td>{h.managerName}</td>
                    <td>
                      <Link 
                        to={`/admin/hostels/${h.hostelId}`}
                        className={styles.actionBtn}
                        style={{
                          display: 'inline-block',
                          padding: '8px 16px',
                          textDecoration: 'none',
                          textAlign: 'center'
                        }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign:"center", padding: "20px" }}>
                    No Hostels Found.
                  </td>
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