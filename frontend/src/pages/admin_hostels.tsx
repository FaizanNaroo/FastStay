
import React, { useEffect, useState } from "react";
import { getAllHostelsTableData, type HostelTableRow } from "../api/admin_hostels";
import styles from "../styles/admin_dashboard.module.css";

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

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Loading Hostels...</h2>
      </div>
    );
  }

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
          <a href="/admin_dashboard">Dashboard</a>
          <a className={styles.active}>Hostels</a>
          <a href="/students">Students</a>
          <a href="/managers">Managers</a>
          <a href="/logout">Logout</a>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>
          <i className="fa-solid fa-building"></i> All Hostels
        </h2>
        <p className={styles.subtitle}>View, manage and edit all hostels listed on FastStay.</p>

        {/* TOP BAR - Same as HTML */}
        <div className="top-bar" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search hostel..." 
              style={{
                padding: "10px 15px",
                width: "260px",
                borderRadius: "10px",
                border: "none",
                outline: "none"
              }}
            />
          </div>

          <div className="filters" style={{ display: "flex", gap: "10px" }}>
            <select style={{
              padding: "10px 15px",
              borderRadius: "10px",
              border: "none",
              outline: "none"
            }}>
              <option selected>Filter by Block / House</option>
              <option>HB-01</option>
              <option>A-05</option>
              <option>B-02</option>
            </select>

            <select style={{
              padding: "10px 15px",
              borderRadius: "10px",
              border: "none",
              outline: "none"
            }}>
              <option selected>Hostel Type</option>
              <option>Portion</option>
              <option>Building</option>
            </select>
          </div>
        </div>

        {/* HOSTELS TABLE */}
        <div className={styles.tableCard}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse"
          }}>
            <thead>
              <tr>
                <th style={{
                  textAlign: "left",
                  padding: "12px",
                  borderBottom: "1px solid #dfd6cb",
                  background: "#f0e7dc",
                  color: "#3b2c24"
                }}>Hostel Name</th>
                <th style={{
                  textAlign: "left",
                  padding: "12px",
                  borderBottom: "1px solid #dfd6cb",
                  background: "#f0e7dc",
                  color: "#3b2c24"
                }}>Block / House</th> {/* Changed from City to Block/House */}
                <th style={{
                  textAlign: "left",
                  padding: "12px",
                  borderBottom: "1px solid #dfd6cb",
                  background: "#f0e7dc",
                  color: "#3b2c24"
                }}>Type</th>
                <th style={{
                  textAlign: "left",
                  padding: "12px",
                  borderBottom: "1px solid #dfd6cb",
                  background: "#f0e7dc",
                  color: "#3b2c24"
                }}>Rooms</th>
                <th style={{
                  textAlign: "left",
                  padding: "12px",
                  borderBottom: "1px solid #dfd6cb",
                  background: "#f0e7dc",
                  color: "#3b2c24"
                }}>Floors</th>
                <th style={{
                  textAlign: "left",
                  padding: "12px",
                  borderBottom: "1px solid #dfd6cb",
                  background: "#f0e7dc",
                  color: "#3b2c24"
                }}>Manager</th> {/* Shows manager name */}
                <th style={{
                  textAlign: "left",
                  padding: "12px",
                  borderBottom: "1px solid #dfd6cb",
                  background: "#f0e7dc",
                  color: "#3b2c24"
                }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {hostels.length > 0 ? (
                hostels.map(h => (
                  <tr key={h.id} style={{
                    borderBottom: "1px solid #dfd6cb"
                  }}>
                    <td style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom: "1px solid #dfd6cb"
                    }}>{h.name}</td>
                    <td style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom: "1px solid #dfd6cb"
                    }}>{h.blockHouse}</td> {/* Changed from h.location to h.blockHouse */}
                    <td style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom: "1px solid #dfd6cb"
                    }}>{h.type}</td>
                    <td style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom: "1px solid #dfd6cb"
                    }}>{h.rooms}</td>
                    <td style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom: "1px solid #dfd6cb"
                    }}>{h.floors}</td>
                    <td style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom: "1px solid #dfd6cb"
                    }}>{h.managerName}</td> {/* Changed from h.managerID to h.managerName */}
                    <td style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom: "1px solid #dfd6cb",
                      display: "flex",
                      gap: "8px"
                    }}>
                      <button style={{
                        background: "#8d5f3a",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "13px",
                        border: "none",
                        cursor: "pointer"
                      }}>View</button>
                      <button style={{
                        background: "#a0744f",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "13px",
                        border: "none",
                        cursor: "pointer"
                      }}>Edit</button>
                      <button style={{
                        background: "#c0392b",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "13px",
                        border: "none",
                        cursor: "pointer"
                      }}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ 
                    textAlign: "center", 
                    color: "#6d5d52",
                    padding: "20px",
                    borderBottom: "1px solid #dfd6cb"
                  }}>
                    No hostels found.
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