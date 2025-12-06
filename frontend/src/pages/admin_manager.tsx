import React, { useEffect, useState } from "react";
import { getAllManagersTableData, type ManagerTableRow } from "../api/admin_manager";
import styles from "../styles/admin_dashboard.module.css"; // <-- your CSS file
import { Link } from "react-router-dom";

const AdminViewManagers: React.FC = () => {
  const [managers, setManagers] = useState<ManagerTableRow[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");


//   const loadManagers = async () => {
//     const data = await getAllManagersTableData();
//     setManagers(data);
//   };

//   useEffect(() => {
//     loadManagers();
//   }, []);


  useEffect(() => {
  const loadManagers = async () => {
    const data = await getAllManagersTableData();
    setManagers(data);
  };
  
    loadManagers();
  }, []);

  // --------- SEARCH + FILTER ----------
  const filteredManagers = managers.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterType === "All" || m.type.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <i className="fa-solid fa-user-shield"></i> FastStay Admin
        </div>

        <div className={styles.navLinks}>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/hostels">Hostels</Link>
          <Link to="/admin/students">Students</Link>
          <Link to="/admin/managers" className={styles.active}>Managers</Link>
          <Link to="/logout">Logout</Link>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className={styles.container}>

        <h2 className={styles.pageTitle}><i className="fa-solid fa-user-tie"></i> Hostel Managers</h2>
        <p className={styles.subtitle}>View and manage hostel manager accounts near FAST Lahore.</p>


        {/* SEARCH + FILTER BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", flexWrap:"wrap", gap:"10px" }}>
          
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search manager..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px", width:"250px", border:"none" }}
          />

          {/* Filter Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding:"10px", borderRadius:"8px", border:"none" }}
          >
            <option value="All">All Types</option>
            <option value="Owner">Owner</option>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
          </select>
        </div>


        {/* TABLE */}
        <div className={styles.tableCard}>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Education</th>
                <th>Operating Hours</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredManagers.length > 0 ? (
                filteredManagers.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.phone}</td>
                    <td>{m.type}</td>
                    <td>{m.education}</td>
                    <td>{m.operatingHours}</td>

                    <td>
                      <button className={styles.actionBtn}>View</button>{" "}
                      <button className={`${styles.actionBtn}`} style={{ background:"#c0392b" }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} style={{ textAlign:"center", padding:"15px" }}>No Managers Found</td></tr>
              )}
            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
};

export default AdminViewManagers;
