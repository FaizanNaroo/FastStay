
// import React, { useEffect, useState, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { getAllHostelsTableData, type HostelTableRow } from "../api/admin_hostels";
// import styles from "../styles/admin_hostel.module.css";

// const ViewHostels: React.FC = () => {
//   const [hostels, setHostels] = useState<HostelTableRow[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState<string>("");
//   const [blockFilter, setBlockFilter] = useState<string>("All");
//   const [typeFilter, setTypeFilter] = useState<string>("All");

//   useEffect(() => {
//     const fetchHostels = async () => {
//       try {
//         const data = await getAllHostelsTableData();
//         setHostels(data);
//         setLoading(false);
//       } catch (err: unknown) {
//         console.error(err);
//         setError("Failed to load hostels.");
//         setLoading(false);
//       }
//     };

//     fetchHostels();
//   }, []);

//   // Get unique blocks and types from data
//   const blockOptions = useMemo(() => {
//     const blocks = new Set(hostels.map(h => h.blockHouse).filter(Boolean));
//     return Array.from(blocks).sort();
//   }, [hostels]);

//   const typeOptions = useMemo(() => {
//     const types = new Set(hostels.map(h => h.type).filter(Boolean));
//     return Array.from(types).sort();
//   }, [hostels]);

//   // Filter hostels based on search and filters
//   const filteredHostels = useMemo(() => {
//     return hostels.filter(h => {
//       // Search filter
//       const searchTerm = search.toLowerCase();
//       const matchesSearch = searchTerm === "" || 
//         h.name.toLowerCase().includes(searchTerm) ||
//         h.blockHouse.toLowerCase().includes(searchTerm) ||
//         h.managerName.toLowerCase().includes(searchTerm);

//       // Block filter
//       const matchesBlock = blockFilter === "All" || h.blockHouse === blockFilter;

//       // Type filter
//       const matchesType = typeFilter === "All" || h.type === typeFilter;

//       return matchesSearch && matchesBlock && matchesType;
//     });
//   }, [hostels, search, blockFilter, typeFilter]);

//   // Show only error on full page if there's a critical error
//   if (error) {
//     return (
//       <div className={styles.container} style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
//         <h2>{error}</h2>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* NAVBAR */}
//       <nav className={styles.navbar}>
//         <div className={styles.logo}>
//           <i className="fa-solid fa-user-shield"></i> FastStay Admin
//         </div>

//         <div className={styles.navLinks}>
//           <Link to="/admin">Dashboard</Link>
//           <Link to="/admin/hostels" className={styles.active}>Hostels</Link>
//           <Link to="/admin/students">Students</Link>
//           <Link to="/admin/managers">Managers</Link>
//           <Link to="/admin/logout">Logout</Link>
//         </div>
//       </nav>

//       {/* MAIN CONTENT */}
//       <div className={styles.container}>
//         <h2 className={styles.pageTitle}>
//           <i className="fa-solid fa-building"></i> All Hostels
//         </h2>
//         <p className={styles.subtitle}>View, manage and edit all hostels listed on FastStay.</p>

//         {/* RESULTS SUMMARY */}
//         {!loading && (
//           <div style={{ 
//             marginBottom: "15px", 
//             color: "#666", 
//             fontSize: "14px",
//             display: "flex",
//             alignItems: "center",
//             gap: "10px"
//           }}>
//             <i className="fa-solid fa-info-circle"></i>
//             <span>
//               Showing {filteredHostels.length} of {hostels.length} hostel(s)
//               {(blockFilter !== "All" || typeFilter !== "All" || search) && " (filtered)"}
//             </span>
//           </div>
//         )}

//         {/* TOP BAR */}
//         <div className={styles.topBar} style={{ marginBottom: "20px" }}>
//           <div className={styles.searchBox}>
//             <input 
//               type="text" 
//               placeholder="Search by name, block, or manager..." 
//               className={styles.searchInput}
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               disabled={loading}
//               style={{ 
//                 backgroundColor: loading ? "#d6c4a1" : "#f5e9d2",  // light muted brown tones
//                 color: loading ? "#7a6648" : "#4c3f30",  
//               }}
//             />
//           </div>

//           <div className={styles.filters} style={{ display: "flex", gap: "15px" }}>
//             <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
//               <label style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}>
//                 Filter by Block / House
//               </label>
//               <select 
//                 className={styles.filterSelect}
//                 value={blockFilter}
//                 onChange={(e) => setBlockFilter(e.target.value)}
//                 disabled={loading}
//                 style={{ 
//                   backgroundColor: loading ? "#d6c4a1" : "#f5e9d2",  // light muted brown tones
//                   color: loading ? "#7a6648" : "#4c3f30",  
//                 }}
//               >
//                 <option value="All">All Blocks ({hostels.length})</option>
//                 {blockOptions.map((block) => (
//                   <option key={block} value={block}>
//                     {block} ({hostels.filter(h => h.blockHouse === block).length})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
//               <label style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}>
//                 Filter by Type
//               </label>
//               <select 
//                 className={styles.filterSelect}
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value)}
//                 disabled={loading}
//                 style={{ 
//                   backgroundColor: loading ? "#d6c4a1" : "#f5e9d2",  // light muted brown tones
//                   color: loading ? "#7a6648" : "#4c3f30",  
//                 }}
//               >
//                 <option value="All">All Types ({hostels.length})</option>
//                 {typeOptions.map((type) => (
//                   <option key={type} value={type}>
//                     {type} ({hostels.filter(h => h.type === type).length})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {(search || blockFilter !== "All" || typeFilter !== "All") && (
//               <button 
//                 onClick={() => {
//                   setSearch("");
//                   setBlockFilter("All");
//                   setTypeFilter("All");
//                 }}
//                 style={{
//                   alignSelf: "flex-end",
//                   padding: "8px 16px",
//                   backgroundColor: "#e74c3c",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "6px",
//                   cursor: "pointer",
//                   fontSize: "14px",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "5px"
//                 }}
//               >
//                 <i className="fa-solid fa-times"></i>
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         </div>

//         {/* HOSTELS TABLE */}
//         <div className={styles.tableCard}>
//           <table className={styles.hostelTable}>
//             <thead>
//               <tr>
//                 <th className={styles.tableHeader}>Hostel Name</th>
//                 <th className={styles.tableHeader}>Block / House</th>
//                 <th className={styles.tableHeader}>Type</th>
//                 <th className={styles.tableHeader}>Rooms</th>
//                 <th className={styles.tableHeader}>Floors</th>
//                 <th className={styles.tableHeader}>Manager</th>
//                 <th className={styles.tableHeader}>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className={styles.loadingCell}>
//                     <div className={styles.loadingContainer}>
//                       <i className="fa-solid fa-spinner fa-spin" style={{ 
//                         marginRight: "10px", 
//                         fontSize: "18px" 
//                       }}></i>
//                       Loading hostels...
//                     </div>
//                   </td>
//                 </tr>
//               ) : filteredHostels.length > 0 ? (
//                 filteredHostels.map(h => (
//                   <tr key={h.id} className={styles.tableRow}>
//                     <td className={styles.tableCell}>
//                       <div style={{ fontWeight: "600", color: "#2c3e50" }}>
//                         {h.name}
//                       </div>
//                       {h.messProvide && (
//                         <div style={{ 
//                           fontSize: "12px", 
//                           color: "#27ae60",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "5px",
//                           marginTop: "3px"
//                         }}>
//                           <i className="fa-solid fa-utensils"></i>
//                           Mess Available
//                         </div>
//                       )}
//                     </td>
//                     <td className={styles.tableCell}>
//                       <span style={{
//                         display: "inline-block",
//                         padding: "4px 8px",
//                         borderRadius: "4px",
//                         fontSize: "12px",
//                         fontWeight: "bold",
//                         backgroundColor: "#e8f4fd",
//                         color: "#2980b9"
//                       }}>
//                         {h.blockHouse}
//                       </span>
//                     </td>
//                     <td className={styles.tableCell}>
//                       <span style={{
//                         display: "inline-block",
//                         padding: "4px 8px",
//                         borderRadius: "4px",
//                         fontSize: "12px",
//                         fontWeight: "bold",
//                         backgroundColor: 
//                           h.type === "Portion" ? "#e8f5e8" : 
//                           h.type === "Building" ? "#f0e8ff" : "#f5f5f5",
//                         color: 
//                           h.type === "Portion" ? "#27ae60" : 
//                           h.type === "Building" ? "#8e44ad" : "#666"
//                       }}>
//                         {h.type}
//                       </span>
//                     </td>
//                     <td className={styles.tableCell}>
//                       <div style={{ 
//                         fontWeight: "bold",
//                         color: "#2c3e50",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "5px"
//                       }}>
//                         <i className="fa-solid fa-door-closed"></i>
//                         {h.rooms}
//                       </div>
//                     </td>
//                     <td className={styles.tableCell}>
//                       <div style={{ 
//                         fontWeight: "bold",
//                         color: "#2c3e50",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "5px"
//                       }}>
//                         <i className="fa-solid fa-building"></i>
//                         {h.floors}
//                       </div>
//                     </td>
//                     <td className={styles.tableCell}>
//                       <div style={{ display: "flex", flexDirection: "column" }}>
//                         <span style={{ fontWeight: "500" }}>{h.managerName}</span>
//                         <span style={{ fontSize: "12px", color: "#666" }}>
//                           ID: {h.managerID}
//                         </span>
//                       </div>
//                     </td>
//                     <td className={styles.actionCell}>
//                       <button 
//                         className={styles.viewBtn}
//                         style={{ marginBottom: "5px" }}
//                       >
//                         <i className="fa-solid fa-eye"></i> View
//                       </button>
//                       <button 
//                         className={styles.editBtn}
//                         style={{ marginBottom: "5px" }}
//                       >
//                         <i className="fa-solid fa-edit"></i> Edit
//                       </button>
//                       <button className={styles.deleteBtn}>
//                         <i className="fa-solid fa-trash"></i> Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={7} className={styles.noDataCell}>
//                     <div style={{ 
//                       display: "flex", 
//                       flexDirection: "column",
//                       alignItems: "center", 
//                       justifyContent: "center",
//                       padding: "40px 20px",
//                       gap: "15px"
//                     }}>
//                       <i className="fa-solid fa-building" style={{ 
//                         fontSize: "48px",
//                         color: "#ddd"
//                       }}></i>
//                       <div style={{ textAlign: "center" }}>
//                         <h4 style={{ marginBottom: "5px", color: "#666" }}>No hostels found</h4>
//                         <p style={{ margin: 0, fontSize: "14px", color: "#999", maxWidth: "400px" }}>
//                           {search || blockFilter !== "All" || typeFilter !== "All" 
//                             ? "No hostels match your current filters. Try adjusting your search criteria."
//                             : "There are no hostels in the system yet."}
//                         </p>
//                         {(search || blockFilter !== "All" || typeFilter !== "All") && (
//                           <button 
//                             onClick={() => {
//                               setSearch("");
//                               setBlockFilter("All");
//                               setTypeFilter("All");
//                             }}
//                             style={{
//                               marginTop: "15px",
//                               padding: "8px 16px",
//                               backgroundColor: "#3498db",
//                               color: "white",
//                               border: "none",
//                               borderRadius: "4px",
//                               cursor: "pointer"
//                             }}
//                           >
//                             Clear all filters
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* EXTRA INFO BAR */}
//         {!loading && filteredHostels.length > 0 && (
//           <div style={{ 
//             marginTop: "20px",
//             padding: "15px",
//             backgroundColor: "#f8f9fa",
//             borderRadius: "8px",
//             border: "1px solid #e9ecef",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             fontSize: "14px",
//             color: "#666"
//           }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//               <i className="fa-solid fa-chart-bar"></i>
//               <span>
//                 Total Rooms: <strong>{filteredHostels.reduce((sum, h) => sum + h.rooms, 0)}</strong> | 
//                 Average Rooms: <strong>{(filteredHostels.reduce((sum, h) => sum + h.rooms, 0) / filteredHostels.length).toFixed(1)}</strong>
//               </span>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//               <i className="fa-solid fa-clock"></i>
//               <span>
//                 {filteredHostels.filter(h => h.messProvide).length} of {filteredHostels.length} hostels provide mess
//               </span>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ViewHostels;






import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getAllHostelsTableData, type HostelTableRow } from "../api/admin_hostels";
import styles from "../styles/admin_hostel.module.css";

const ViewHostels: React.FC = () => {
  const [hostels, setHostels] = useState<HostelTableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [blockFilter, setBlockFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const data = await getAllHostelsTableData();
        setHostels(data);
        setLoading(false);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to load hostels.");
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  // Get unique blocks and types from data
  const blockOptions = useMemo(() => {
    const blocks = new Set(hostels.map(h => h.blockHouse).filter(Boolean));
    return Array.from(blocks).sort();
  }, [hostels]);

  const typeOptions = useMemo(() => {
    const types = new Set(hostels.map(h => h.type).filter(Boolean));
    return Array.from(types).sort();
  }, [hostels]);

  // Filter hostels based on search and filters
  const filteredHostels = useMemo(() => {
    return hostels.filter(h => {
      // Search filter
      const searchTerm = search.toLowerCase();
      const matchesSearch = searchTerm === "" || 
        h.name.toLowerCase().includes(searchTerm) ||
        h.blockHouse.toLowerCase().includes(searchTerm) ||
        h.managerName.toLowerCase().includes(searchTerm);

      // Block filter
      const matchesBlock = blockFilter === "All" || h.blockHouse === blockFilter;

      // Type filter
      const matchesType = typeFilter === "All" || h.type === typeFilter;

      return matchesSearch && matchesBlock && matchesType;
    });
  }, [hostels, search, blockFilter, typeFilter]);

  // Show only error on full page if there's a critical error
  if (error) {
    return (
      <div className={styles.container} style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <i className="fa-solid fa-user-shield"></i> FastStay Admin
        </div>

        <div className={styles.navLinks}>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/hostels" className={styles.active}>Hostels</Link>
          <Link to="/admin/students">Students</Link>
          <Link to="/admin/managers">Managers</Link>
          <Link to="/admin/logout">Logout</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>
          <i className="fa-solid fa-building"></i> All Hostels
        </h2>
        <p className={styles.subtitle}>View, manage and edit all hostels listed on FastStay.</p>

        {/* RESULTS SUMMARY */}
        {!loading && (
          <div style={{ 
            marginBottom: "15px", 
            color: "#666", 
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <i className="fa-solid fa-info-circle"></i>
            <span>
              Showing {filteredHostels.length} of {hostels.length} hostel(s)
              {(blockFilter !== "All" || typeFilter !== "All" || search) && " (filtered)"}
            </span>
          </div>
        )}

        {/* TOP BAR */}
        <div className={styles.topBar} style={{ marginBottom: "20px" }}>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Search by name, block, or manager..." 
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={loading}
              style={{ 
                backgroundColor: loading ? "#d6c4a1" : "#f5e9d2",  // light muted brown tones
                color: loading ? "#7a6648" : "#4c3f30",  
              }}
            />
          </div>

          <div className={styles.filters} style={{ display: "flex", gap: "15px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}>
                Filter by Block / House
              </label>
              <select 
                className={styles.filterSelect}
                value={blockFilter}
                onChange={(e) => setBlockFilter(e.target.value)}
                disabled={loading}
                style={{ 
                  backgroundColor: loading ? "#d6c4a1" : "#f5e9d2",  // light muted brown tones
                  color: loading ? "#7a6648" : "#4c3f30",  
                }}
              >
                <option value="All">All Blocks ({hostels.length})</option>
                {blockOptions.map((block) => (
                  <option key={block} value={block}>
                    {block} ({hostels.filter(h => h.blockHouse === block).length})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}>
                Filter by Type
              </label>
              <select 
                className={styles.filterSelect}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                disabled={loading}
                style={{ 
                  backgroundColor: loading ? "#d6c4a1" : "#f5e9d2",  // light muted brown tones
                  color: loading ? "#7a6648" : "#4c3f30",  
                }}
              >
                <option value="All">All Types ({hostels.length})</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type} ({hostels.filter(h => h.type === type).length})
                  </option>
                ))}
              </select>
            </div>

            {(search || blockFilter !== "All" || typeFilter !== "All") && (
              <button 
                onClick={() => {
                  setSearch("");
                  setBlockFilter("All");
                  setTypeFilter("All");
                }}
                style={{
                  alignSelf: "flex-end",
                  padding: "8px 16px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <i className="fa-solid fa-times"></i>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* HOSTELS TABLE */}
        <div className={styles.tableCard}>
          <table className={styles.hostelTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Hostel Name</th>
                <th className={styles.tableHeader}>Block / House</th>
                <th className={styles.tableHeader}>Type</th>
                <th className={styles.tableHeader}>Rooms</th>
                <th className={styles.tableHeader}>Floors</th>
                <th className={styles.tableHeader}>Manager</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className={styles.loadingCell}>
                    <div className={styles.loadingContainer}>
                      <i className="fa-solid fa-spinner fa-spin" style={{ 
                        marginRight: "10px", 
                        fontSize: "18px" 
                      }}></i>
                      Loading hostels...
                    </div>
                  </td>
                </tr>
              ) : filteredHostels.length > 0 ? (
                filteredHostels.map(h => (
                  <tr key={h.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div style={{ fontWeight: "600", color: "#2c3e50" }}>
                        {h.name}
                      </div>
                      {h.messProvide && (
                        <div style={{ 
                          fontSize: "12px", 
                          color: "#27ae60",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          marginTop: "3px"
                        }}>
                          <i className="fa-solid fa-utensils"></i>
                          Mess Available
                        </div>
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      <span style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor: "#e8f4fd",
                        color: "#2980b9"
                      }}>
                        {h.blockHouse}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor: 
                          h.type === "Portion" ? "#e8f5e8" : 
                          h.type === "Building" ? "#f0e8ff" : "#f5f5f5",
                        color: 
                          h.type === "Portion" ? "#27ae60" : 
                          h.type === "Building" ? "#8e44ad" : "#666"
                      }}>
                        {h.type}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <div style={{ 
                        fontWeight: "bold",
                        color: "#2c3e50",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}>
                        <i className="fa-solid fa-door-closed"></i>
                        {h.rooms}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div style={{ 
                        fontWeight: "bold",
                        color: "#2c3e50",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}>
                        <i className="fa-solid fa-building"></i>
                        {h.floors}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "500" }}>{h.managerName}</span>
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          ID: {h.managerID}
                        </span>
                      </div>
                    </td>
                    <td className={styles.actionCell}>
                      <Link 
                        to={`/admin/hostels/${h.id}`}
                        className={styles.viewBtn}
                        style={{ 
                          marginBottom: "5px",
                          display: "inline-block",
                          padding: "8px 16px",
                          backgroundColor: "#3498db",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          textDecoration: "none",
                          textAlign: "center",
                          width: "100%"
                        }}
                      >
                        <i className="fa-solid fa-eye"></i> View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.noDataCell}>
                    <div style={{ 
                      display: "flex", 
                      flexDirection: "column",
                      alignItems: "center", 
                      justifyContent: "center",
                      padding: "40px 20px",
                      gap: "15px"
                    }}>
                      <i className="fa-solid fa-building" style={{ 
                        fontSize: "48px",
                        color: "#ddd"
                      }}></i>
                      <div style={{ textAlign: "center" }}>
                        <h4 style={{ marginBottom: "5px", color: "#666" }}>No hostels found</h4>
                        <p style={{ margin: 0, fontSize: "14px", color: "#999", maxWidth: "400px" }}>
                          {search || blockFilter !== "All" || typeFilter !== "All" 
                            ? "No hostels match your current filters. Try adjusting your search criteria."
                            : "There are no hostels in the system yet."}
                        </p>
                        {(search || blockFilter !== "All" || typeFilter !== "All") && (
                          <button 
                            onClick={() => {
                              setSearch("");
                              setBlockFilter("All");
                              setTypeFilter("All");
                            }}
                            style={{
                              marginTop: "15px",
                              padding: "8px 16px",
                              backgroundColor: "#3498db",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer"
                            }}
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* EXTRA INFO BAR */}
        {!loading && filteredHostels.length > 0 && (
          <div style={{ 
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "14px",
            color: "#666"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="fa-solid fa-chart-bar"></i>
              <span>
                Total Rooms: <strong>{filteredHostels.reduce((sum, h) => sum + h.rooms, 0)}</strong> | 
                Average Rooms: <strong>{(filteredHostels.reduce((sum, h) => sum + h.rooms, 0) / filteredHostels.length).toFixed(1)}</strong>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="fa-solid fa-clock"></i>
              <span>
                {filteredHostels.filter(h => h.messProvide).length} of {filteredHostels.length} hostels provide mess
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewHostels;