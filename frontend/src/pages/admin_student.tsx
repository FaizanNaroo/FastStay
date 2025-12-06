// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getAllStudentsTableData, type StudentTableRow } from "../api/admin_student";
// import styles from "../styles/admin_student.module.css";  // <-- your CSS file

// const AdminViewStudents: React.FC = () => {
//     const [students, setStudents] = useState<StudentTableRow[]>([]);
//     const [search, setSearch] = useState<string>("");

//     useEffect(() => {
//         const loadData = async () => {
//             const result = await getAllStudentsTableData();
//             setStudents(result);
//         };
//         loadData();
//     }, []);

//     const filteredStudents = students.filter(s =>
//         s.name.toLowerCase().includes(search.toLowerCase()) ||
//         s.city.toLowerCase().includes(search.toLowerCase())
//     );

//     return (
//         <div className={styles.body}>
            
//             {/* NAVBAR */}
//             <nav className={styles.navbar}>
//                 <div className={styles.logo}>
//                     <i className="fa-solid fa-user-shield"></i> FastStay Admin
//                 </div>

//                 <div className={styles.navLinks}>
//                     <Link to="/admin" className={styles.navLink}>Dashboard</Link>
//                     <Link to="/admin/hostels" className={styles.navLink}>Hostels</Link>
//                     <Link to="/admin/students" className={`${styles.navLink} ${styles.activeNavLink}`}>Students</Link>
//                     <Link to="/admin/managers" className={styles.navLink}>Managers</Link>
//                     <Link to="/admin/logout" className={styles.navLink}>Logout</Link>
//                 </div>
//             </nav>

//             {/* MAIN */}
//             <div className={styles.container}>
//                 <h2 className={styles.pageTitle}><i className="fa-solid fa-user-graduate"></i> All Students</h2>
//                 <p className={styles.subtitle}>View and manage student accounts registered on FastStay.</p>

//                 {/* SEARCH + FILTER BAR */}
//                 <div className={styles.topBar}>
//                     <div className={styles.searchBox}>
//                         <input 
//                             type="text"
//                             placeholder="Search student..."
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             className={styles.searchInput}
//                         />
//                     </div>

//                     <div className={styles.filters}>
//                         <select className={styles.select}>
//                             <option selected>Filter by City</option>
//                             <option>Lahore</option>
//                             <option>Islamabad</option>
//                             <option>Karachi</option>
//                             <option>Faisalabad</option>
//                         </select>

//                         <select className={styles.select}>
//                             <option selected>Gender</option>
//                             <option>Male</option>
//                             <option>Female</option>
//                         </select>
//                     </div>
//                 </div>

//                 {/* TABLE */}
//                 <div className={styles.tableCard}>
//                     <table className={styles.table}>
//                         <thead>
//                             <tr>
//                                 <th>Name</th>
//                                 <th>Age</th>
//                                 <th>City</th>
//                                 <th>Gender</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {filteredStudents.length > 0 ? (
//                                 filteredStudents.map(student => (
//                                     <tr key={student.id} className={styles.tableRow}>
//                                         <td>{student.name}</td>
//                                         <td>{student.age}</td>
//                                         <td>{student.city}</td>
//                                         <td>{student.gender}</td>
//                                         <td>
//                                             <button className={styles.actionBtn}>View</button>
//                                             <button className={`${styles.actionBtn} ${styles.deleteBtn}`}>Delete</button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={6} style={{ textAlign: "center", color: "gray" }}>
//                                         No Students Found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminViewStudents;





import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllStudentsTableData, type StudentTableRow } from "../api/admin_student";
import styles from "../styles/admin_student.module.css";

const AdminViewStudents: React.FC = () => {
    const [students, setStudents] = useState<StudentTableRow[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await getAllStudentsTableData();
                setStudents(result);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to load students data. Please try again later.");
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase())
    );

    // Show only error on full page if there's a critical error
    if (error) {
        return (
            <div className={styles.container} style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div className={styles.body}>
            
            {/* NAVBAR */}
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <i className="fa-solid fa-user-shield"></i> FastStay Admin
                </div>

                <div className={styles.navLinks}>
                    <Link to="/admin" className={styles.navLink}>Dashboard</Link>
                    <Link to="/admin/hostels" className={styles.navLink}>Hostels</Link>
                    <Link to="/admin/students" className={`${styles.navLink} ${styles.activeNavLink}`}>Students</Link>
                    <Link to="/admin/managers" className={styles.navLink}>Managers</Link>
                    <Link to="/admin/logout" className={styles.navLink}>Logout</Link>
                </div>
            </nav>

            {/* MAIN */}
            <div className={styles.container}>
                <h2 className={styles.pageTitle}><i className="fa-solid fa-user-graduate"></i> All Students</h2>
                <p className={styles.subtitle}>View and manage student accounts registered on FastStay.</p>

                {/* SEARCH + FILTER BAR */}
                <div className={styles.topBar}>
                    <div className={styles.searchBox}>
                        <input 
                            type="text"
                            placeholder="Search student..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                            disabled={loading}
                            style={{
                                backgroundColor: loading ? "#f5f5f5" : "white",
                                color: loading ? "#999" : "inherit"
                            }}
                        />
                    </div>

                    <div className={styles.filters}>
                        <select className={styles.select} disabled={loading}>
                            <option selected>Filter by City</option>
                            <option>Lahore</option>
                            <option>Islamabad</option>
                            <option>Karachi</option>
                            <option>Faisalabad</option>
                        </select>

                        <select className={styles.select} disabled={loading}>
                            <option selected>Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                </div>

                {/* TABLE */}
                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>City</th>
                                <th>Gender</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className={styles.loadingRow}>
                                        <div className={styles.loadingContainer}>
                                            <i className="fa-solid fa-spinner fa-spin" 
                                               style={{ marginRight: "10px", fontSize: "18px" }}></i>
                                            Loading students data...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <tr key={student.id} className={styles.tableRow}>
                                        <td>{student.name}</td>
                                        <td>{student.age}</td>
                                        <td>{student.city}</td>
                                        <td>{student.gender}</td>
                                        <td>
                                            <button className={styles.actionBtn} disabled={loading}>View</button>
                                            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} disabled={loading}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : search ? (
                                <tr>
                                    <td colSpan={5} className={styles.noDataRow}>
                                        <div className={styles.noDataContainer}>
                                            <i className="fa-solid fa-search" style={{ marginRight: "10px" }}></i>
                                            No students found matching your search.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan={5} className={styles.noDataRow}>
                                        <div className={styles.noDataContainer}>
                                            <i className="fa-solid fa-user-graduate" style={{ marginRight: "10px" }}></i>
                                            No students found in the system.
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

export default AdminViewStudents;