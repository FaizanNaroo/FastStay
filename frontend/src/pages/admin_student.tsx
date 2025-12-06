


import React, { useEffect, useState } from "react";
import { getAllStudentsTableData, type StudentTableRow } from "../api/admin_student";
import "../styles/admin_dashboard.module.css";

const AdminViewStudents: React.FC = () => {
    const [students, setStudents] = useState<StudentTableRow[]>([]);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const loadData = async () => {
            const result = await getAllStudentsTableData();
            setStudents(result);
        };
        loadData();
    }, []);

    // Search Filter
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.city.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={styles.body}>
            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.logo}>
                    <i className="fa-solid fa-user-shield"></i> FastStay Admin
                </div>
                <div style={styles.navLinks}>
                    <a href="admin_dashboard.html" style={styles.navLink}>Dashboard</a>
                    <a href="admin_view_hostels.html" style={styles.navLink}>Hostels</a>
                    <a href="#" style={{...styles.navLink, ...styles.activeNavLink}}>Students</a>
                    <a href="admin_view_managers.html" style={styles.navLink}>Managers</a>
                    <a href="logout.html" style={styles.navLink}>Logout</a>
                </div>
            </nav>

            {/* MAIN */}
            <div style={styles.container}>
                <h2 style={styles.pageTitle}><i className="fa-solid fa-user-graduate"></i> All Students</h2>
                <p style={styles.subtitle}>View and manage student accounts registered on FastStay.</p>

                {/* TOP BAR */}
                <div style={styles.topBar}>
                    <div style={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>

                    <div style={styles.filters}>
                        <select style={styles.select}>
                            <option selected>Filter by City</option>
                            <option>Lahore</option>
                            <option>Islamabad</option>
                            <option>Karachi</option>
                            <option>Faisalabad</option>
                        </select>

                        <select style={styles.select}>
                            <option selected>Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                </div>

                {/* STUDENTS TABLE */}
                <div style={styles.tableCard}>
                    <table style={styles.table}>
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
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <tr key={student.id} style={styles.tableRow}>
                                        <td>{student.name}</td>
                                        <td>{student.age}</td>
                                        <td>{student.city}</td>
                                        <td>{student.gender}</td>
                                        <td>
                                            <button style={styles.actionBtn}>View</button>
                                            <button style={{...styles.actionBtn, ...styles.deleteBtn}}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: "center", color: "gray" }}>
                                        No Students Found
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

const styles = {
    body: {
        margin: 0,
        padding: 0,
        backgroundColor: "#3b2c24",
        color: "#f8f3e7",
        fontFamily: "'Poppins', sans-serif",
        minHeight: "100vh"
    } as React.CSSProperties,
    navbar: {
        width: "100%",
        padding: "15px 35px",
        background: "#2b211c",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0px 4px 18px rgba(0,0,0,0.3)"
    } as React.CSSProperties,
    logo: {
        fontSize: "24px",
        fontWeight: 600
    } as React.CSSProperties,
    navLinks: {
        display: "flex",
        alignItems: "center"
    } as React.CSSProperties,
    navLink: {
        marginLeft: "25px",
        textDecoration: "none",
        fontSize: "15px",
        color: "#f8f3e7"
    } as React.CSSProperties,
    activeNavLink: {
        color: "#d4b498"
    } as React.CSSProperties,
    container: {
        maxWidth: "1200px",
        margin: "auto",
        padding: "30px"
    } as React.CSSProperties,
    pageTitle: {
        fontSize: "28px",
        marginBottom: "5px"
    } as React.CSSProperties,
    subtitle: {
        color: "#d6c7ba",
        marginBottom: "25px"
    } as React.CSSProperties,
    topBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        flexWrap: "wrap" as const,
        gap: "10px"
    } as React.CSSProperties,
    searchBox: {
        flexShrink: 0
    } as React.CSSProperties,
    searchInput: {
        padding: "10px 15px",
        width: "260px",
        borderRadius: "10px",
        border: "none",
        outline: "none",
        fontFamily: "'Poppins', sans-serif"
    } as React.CSSProperties,
    filters: {
        display: "flex",
        gap: "10px"
    } as React.CSSProperties,
    select: {
        padding: "10px 15px",
        borderRadius: "10px",
        border: "none",
        outline: "none",
        fontFamily: "'Poppins', sans-serif",
        cursor: "pointer"
    } as React.CSSProperties,
    tableCard: {
        background: "#f8f3e7",
        color: "#3b2c24",
        padding: "20px",
        borderRadius: "16px",
        marginBottom: "35px",
        boxShadow: "0px 6px 18px rgba(0,0,0,0.25)"
    } as React.CSSProperties,
    table: {
        width: "100%",
        borderCollapse: "collapse" as const
    } as React.CSSProperties,
    tableRow: {
        "&:hover": {
            background: "#f9f4ee"
        }
    } as React.CSSProperties,
    actionBtn: {
        background: "#8d5f3a",
        padding: "6px 10px",
        borderRadius: "8px",
        color: "white",
        fontSize: "13px",
        border: "none",
        cursor: "pointer",
        marginRight: "5px",
        fontFamily: "'Poppins', sans-serif"
    } as React.CSSProperties,
    deleteBtn: {
        background: "#c0392b"
    } as React.CSSProperties
};

export default AdminViewStudents;


