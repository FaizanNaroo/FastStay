
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getAllHostelsTableData, type HostelTableRow } from "../api/admin_hostels";
// import styles from "../styles/admin_hostel.module.css";

// const ViewHostels: React.FC = () => {
//   const [hostels, setHostels] = useState<HostelTableRow[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

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

//   if (loading) {
//     return (
//       <div className={styles.container} style={{ textAlign: "center", marginTop: "50px" }}>
//         <h2>Loading Hostels...</h2>
//       </div>
//     );
//   }

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

//         {/* TOP BAR */}
//         <div className={styles.topBar}>
//           <div className={styles.searchBox}>
//             <input 
//               type="text" 
//               placeholder="Search hostel..." 
//               className={styles.searchInput}
//             />
//           </div>

//           <div className={styles.filters}>
//             <select className={styles.filterSelect}>
//               <option selected>Filter by Block / House</option>
//               <option>HB-01</option>
//               <option>A-05</option>
//               <option>B-02</option>
//             </select>

//             <select className={styles.filterSelect}>
//               <option selected>Hostel Type</option>
//               <option>Portion</option>
//               <option>Building</option>
//             </select>
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
//               {hostels.length > 0 ? (
//                 hostels.map(h => (
//                   <tr key={h.id} className={styles.tableRow}>
//                     <td className={styles.tableCell}>{h.name}</td>
//                     <td className={styles.tableCell}>{h.blockHouse}</td>
//                     <td className={styles.tableCell}>{h.type}</td>
//                     <td className={styles.tableCell}>{h.rooms}</td>
//                     <td className={styles.tableCell}>{h.floors}</td>
//                     <td className={styles.tableCell}>{h.managerName}</td>
//                     <td className={styles.actionCell}>
//                       <button className={styles.viewBtn}>View</button>
//                       <button className={styles.editBtn}>Edit</button>
//                       <button className={styles.deleteBtn}>Delete</button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={7} className={styles.noDataCell}>
//                     No hostels found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ViewHostels;




import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllHostelsTableData, type HostelTableRow } from "../api/admin_hostels";
import styles from "../styles/admin_hostel.module.css";

const ViewHostels: React.FC = () => {
  const [hostels, setHostels] = useState<HostelTableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

        {/* TOP BAR */}
        <div className={styles.topBar}>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Search hostel..." 
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filters}>
            <select className={styles.filterSelect}>
              <option selected>Filter by Block / House</option>
              <option>HB-01</option>
              <option>A-05</option>
              <option>B-02</option>
            </select>

            <select className={styles.filterSelect}>
              <option selected>Hostel Type</option>
              <option>Portion</option>
              <option>Building</option>
            </select>
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
              ) : hostels.length > 0 ? (
                hostels.map(h => (
                  <tr key={h.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{h.name}</td>
                    <td className={styles.tableCell}>{h.blockHouse}</td>
                    <td className={styles.tableCell}>{h.type}</td>
                    <td className={styles.tableCell}>{h.rooms}</td>
                    <td className={styles.tableCell}>{h.floors}</td>
                    <td className={styles.tableCell}>{h.managerName}</td>
                    <td className={styles.actionCell}>
                      <button className={styles.viewBtn}>View</button>
                      <button className={styles.editBtn}>Edit</button>
                      <button className={styles.deleteBtn}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.noDataCell}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="fa-solid fa-building" style={{ 
                        marginRight: "10px", 
                        color: "#666",
                        fontSize: "18px"
                      }}></i>
                      No hostels found.
                    </div>
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

export default ViewHostels;