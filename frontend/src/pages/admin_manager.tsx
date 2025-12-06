
// import React, { useEffect, useState } from "react";
// import { getAllManagersTableData, type ManagerTableRow } from "../api/admin_manager";
// import styles from "../styles/admin_dashboard.module.css";
// import { Link } from "react-router-dom";

// const AdminViewManagers: React.FC = () => {
//   const [managers, setManagers] = useState<ManagerTableRow[]>([]);
//   const [search, setSearch] = useState("");
//   const [filterType, setFilterType] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadManagers = async () => {
//       try {
//         setLoading(true);
//         const data = await getAllManagersTableData();
//         setManagers(data);
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load managers data. Please try again later.");
//         setLoading(false);
//       }
//     };
    
//     loadManagers();
//   }, []);

//   // --------- SEARCH + FILTER ----------
//   const filteredManagers = managers.filter(m => {
//     const matchesSearch =
//       m.name.toLowerCase().includes(search.toLowerCase()) ||
//       m.phone.toLowerCase().includes(search.toLowerCase());

//     const matchesFilter =
//       filterType === "All" || m.type.toLowerCase() === filterType.toLowerCase();

//     return matchesSearch && matchesFilter;
//   });

//   // Show only error on full page if there's a critical error
//   if (error) {
//     return (
//       <div className={styles.container} style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
//         <h2>{error}</h2>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* NAVBAR */}
//       <nav className={styles.navbar}>
//         <div className={styles.logo}>
//           <i className="fa-solid fa-user-shield"></i> FastStay Admin
//         </div>

//         <div className={styles.navLinks}>
//           <Link to="/admin">Dashboard</Link>
//           <Link to="/admin/hostels">Hostels</Link>
//           <Link to="/admin/students">Students</Link>
//           <Link to="/admin/managers" className={styles.active}>Managers</Link>
//           <Link to="/admin/logout">Logout</Link>
//         </div>
//       </nav>

//       {/* PAGE CONTENT */}
//       <div className={styles.container}>

//         <h2 className={styles.pageTitle}><i className="fa-solid fa-user-tie"></i> Hostel Managers</h2>
//         <p className={styles.subtitle}>View and manage hostel manager accounts near FAST Lahore.</p>

//         {/* SEARCH + FILTER BAR */}
//         <div style={{ 
//           display: "flex", 
//           justifyContent: "space-between", 
//           marginBottom: "20px", 
//           flexWrap: "wrap", 
//           gap: "10px" 
//         }}>
          
//           {/* Search Field */}
//           <input
//             type="text"
//             placeholder="Search manager..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{ 
//               padding: "10px", 
//               borderRadius: "8px", 
//               width: "250px", 
//               border: "1px solid #ddd",
//               backgroundColor: loading ? "#f5f5f5" : "white",
//               color: loading ? "#999" : "inherit"
//             }}
//             disabled={loading}
//           />

//           {/* Filter Dropdown */}
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             style={{ 
//               padding: "10px", 
//               borderRadius: "8px", 
//               border: "1px solid #ddd",
//               backgroundColor: loading ? "#f5f5f5" : "white",
//               color: loading ? "#999" : "inherit"
//             }}
//             disabled={loading}
//           >
//             <option value="All">All Types</option>
//             <option value="Owner">Owner</option>
//             <option value="Employee">Employee</option>
//             <option value="Manager">Manager</option>
//           </select>
//         </div>

//         {/* TABLE */}
//         <div className={styles.tableCard}>
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Phone</th>
//                 <th>Type</th>
//                 <th>Education</th>
//                 <th>Operating Hours</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} style={{ 
//                     textAlign: "center", 
//                     padding: "40px 20px",
//                     color: "#666"
//                   }}>
//                     <div style={{ 
//                       display: "flex", 
//                       alignItems: "center", 
//                       justifyContent: "center",
//                       flexDirection: "column",
//                       gap: "10px"
//                     }}>
//                       <i className="fa-solid fa-spinner fa-spin" style={{ 
//                         fontSize: "20px",
//                         color: "#3498db"
//                       }}></i>
//                       <span>Loading managers data...</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredManagers.length > 0 ? (
//                 filteredManagers.map((m) => (
//                   <tr key={m.id}>
//                     <td>{m.name}</td>
//                     <td>{m.phone}</td>
//                     <td>{m.type}</td>
//                     <td>{m.education}</td>
//                     <td>{m.operatingHours}</td>
//                     <td>
//                       <button className={styles.actionBtn}>View</button>{" "}
//                       <button className={`${styles.actionBtn}`} style={{ background: "#c0392b" }}>
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : search || filterType !== "All" ? (
//                 <tr>
//                   <td colSpan={6} style={{ 
//                     textAlign: "center", 
//                     padding: "30px 20px",
//                     color: "#666"
//                   }}>
//                     <div style={{ 
//                       display: "flex", 
//                       alignItems: "center", 
//                       justifyContent: "center",
//                       gap: "10px"
//                     }}>
//                       <i className="fa-solid fa-search" style={{ color: "#999" }}></i>
//                       <span>No managers found matching your search criteria.</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 <tr>
//                   <td colSpan={6} style={{ 
//                     textAlign: "center", 
//                     padding: "30px 20px",
//                     color: "#666"
//                   }}>
//                     <div style={{ 
//                       display: "flex", 
//                       alignItems: "center", 
//                       justifyContent: "center",
//                       gap: "10px"
//                     }}>
//                       <i className="fa-solid fa-user-tie" style={{ color: "#999" }}></i>
//                       <span>No managers found in the system.</span>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminViewManagers;





import React, { useEffect, useState } from "react";
import { getAllManagersTableData, type ManagerTableRow } from "../api/admin_manager";
import styles from "../styles/admin_dashboard.module.css";
import { Link } from "react-router-dom";

const AdminViewManagers: React.FC = () => {
  const [managers, setManagers] = useState<ManagerTableRow[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadManagers = async () => {
      try {
        setLoading(true);
        const data = await getAllManagersTableData();
        setManagers(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load managers data. Please try again later.");
        setLoading(false);
      }
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

  // Show only error on full page if there's a critical error
  if (error) {
    return (
      <div className={styles.container} style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <i className="fa-solid fa-user-shield"></i> FastStay Admin
        </div>

        <div className={styles.navLinks}>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/hostels">Hostels</Link>
          <Link to="/admin/students">Students</Link>
          <Link to="/admin/managers" className={styles.active}>Managers</Link>
          <Link to="/admin/logout">Logout</Link>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className={styles.container}>

        <h2 className={styles.pageTitle}><i className="fa-solid fa-user-tie"></i> Hostel Managers</h2>
        <p className={styles.subtitle}>View and manage hostel manager accounts near FAST Lahore.</p>

        {/* SEARCH + FILTER BAR */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: "20px", 
          flexWrap: "wrap", 
          gap: "10px" 
        }}>
          
          {/* Search Field */}
          <input
            type="text"
            placeholder="Search manager..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              padding: "10px", 
              borderRadius: "8px", 
              width: "250px", 
              border: "1px solid #ddd",
              backgroundColor: loading ? "#f5f5f5" : "white",
              color: loading ? "#999" : "inherit"
            }}
            disabled={loading}
          />

          {/* Filter Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ 
              padding: "10px", 
              borderRadius: "8px", 
              border: "1px solid #ddd",
              backgroundColor: loading ? "#f5f5f5" : "white",
              color: loading ? "#999" : "inherit"
            }}
            disabled={loading}
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
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ 
                    textAlign: "center", 
                    padding: "40px 20px",
                    color: "#666"
                  }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      gap: "10px"
                    }}>
                      <i className="fa-solid fa-spinner fa-spin" style={{ 
                        fontSize: "18px",
                        marginRight: "8px"
                      }}></i>
                      Loading managers...
                    </div>
                  </td>
                </tr>
              ) : filteredManagers.length > 0 ? (
                filteredManagers.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.phone}</td>
                    <td>{m.type}</td>
                    <td>{m.education}</td>
                    <td>{m.operatingHours}</td>
                    <td>
                      <button className={styles.actionBtn}>View</button>{" "}
                      <button className={`${styles.actionBtn}`} style={{ background: "#c0392b" }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : search || filterType !== "All" ? (
                <tr>
                  <td colSpan={6} style={{ 
                    textAlign: "center", 
                    padding: "20px",
                    color: "#666"
                  }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      gap: "10px"
                    }}>
                      <i className="fa-solid fa-search" style={{ 
                        marginRight: "10px", 
                        color: "#666",
                        fontSize: "18px"
                      }}></i>
                      No managers found matching your search criteria.
                    </div>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={6} style={{ 
                    textAlign: "center", 
                    padding: "20px",
                    color: "#666"
                  }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      gap: "10px"
                    }}>
                      <i className="fa-solid fa-user-tie" style={{ 
                        marginRight: "10px", 
                        color: "#666",
                        fontSize: "18px"
                      }}></i>
                      No managers found in the system.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminViewManagers;