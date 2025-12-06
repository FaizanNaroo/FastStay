import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getManagerById, getUserForManager, type ManagerTableRow } from "../api/admin_manager_review";
import type { RawUser } from "../api/admin_manager_review";
import styles from "../styles/admin_dashboard.module.css";
import managerStyles from "../styles/admin_manager_profile.module.css";

const AdminManagerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [manager, setManager] = useState<ManagerTableRow | null>(null);
  const [userDetails, setUserDetails] = useState<RawUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManagerData = async () => {
      if (!id) {
        setError("Manager ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const managerId = parseInt(id);
        
        // Fetch manager details and user details in parallel
        const [managerData, userData] = await Promise.all([
          getManagerById(managerId),
          getUserForManager(managerId)
        ]);

        if (managerData) {
          setManager(managerData);
          setUserDetails(userData);
        } else {
          setError(`Manager with ID ${managerId} not found`);
        }
      } catch (err) {
        console.error("Error fetching manager profile:", err);
        setError("Failed to load manager profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [id]);

  const handleDelete = async () => {
    if (!manager) return;
    
    if (window.confirm(`Are you sure you want to delete ${manager.name}? This action cannot be undone.`)) {
      try {
        // Add your delete API call here
        console.log("Deleting manager:", manager.id);
        // await deleteManager(manager.id);
        
        // Navigate back to managers list after deletion
        navigate("/admin/managers");
      } catch (err) {
        console.error("Error deleting manager:", err);
        alert("Failed to delete manager. Please try again.");
      }
    }
  };

  const formatOperatingHours = (hours: number) => {
    // Assuming operating hours is a number representing total hours per day
    if (hours === 24) return "24 hours";
    if (hours <= 12) return `${hours} hours`;
    
    // Convert to 12-hour format if needed
    const start = 9; // Default start time
    const end = start + hours;
    return `${start}:00 AM - ${end % 12 || 12}:00 ${end < 12 ? 'AM' : 'PM'}`;
  };

  if (loading) {
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
        
        <div className={styles.container}>
          <div className={managerStyles.loadingContainer}>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: "10px" }}></i>
            Loading manager profile...
          </div>
        </div>
      </div>
    );
  }

  if (error || !manager) {
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
        
        <div className={styles.container}>
          <div className={managerStyles.errorContainer}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: "48px", marginBottom: "20px" }}></i>
            <h2>Error Loading Manager</h2>
            <p>{error || "Manager not found"}</p>
            <button 
              className={managerStyles.backButton} 
              onClick={() => navigate("/admin/managers")}
              style={{ marginTop: "20px" }}
            >
              <i className="fas fa-arrow-left"></i> Back to Managers List
            </button>
          </div>
        </div>
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
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/hostels">Hostels</Link>
          <Link to="/admin/students">Students</Link>
          <Link to="/admin/managers" className={styles.active}>Managers</Link>
          <Link to="/logout">Logout</Link>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className={styles.container}>
        <div className={managerStyles.managerProfileCard}>
          {/* Header with Back Button */}
          <div className={managerStyles.profileHeader}>
            <div>
              <h2 className={styles.pageTitle}>
                <i className="fa-solid fa-user-tie"></i> Manager Profile
              </h2>
              <p className={styles.subtitle}>Complete details of {manager.name}</p>
            </div>
            <button 
              className={managerStyles.backButton} 
              onClick={() => navigate("/admin/managers")}
            >
              <i className="fas fa-arrow-left"></i> Back to List
            </button>
          </div>

          {/* Profile Content */}
          <div className={managerStyles.profileBox}>
            {/* Profile Image */}
            <div>
              <div className={managerStyles.photoLabel}>Profile Photo</div>
              <img 
                src={manager.photoLink || "https://via.placeholder.com/180"} 
                alt={manager.name} 
                className={managerStyles.profileImg}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/180";
                }}
              />
            </div>

            {/* Manager Information Grid */}
            <div className={managerStyles.profileInfo}>
              <div className={managerStyles.infoItem}>
                <div className={managerStyles.label}>Full Name</div>
                <div className={managerStyles.value}>{manager.name}</div>
              </div>

              <div className={managerStyles.infoItem}>
                <div className={managerStyles.label}>Phone Number</div>
                <div className={managerStyles.value}>
                  <i className="fas fa-phone" style={{ marginRight: "8px", color: "#8d5f3a" }}></i>
                  {manager.phone}
                </div>
              </div>

              <div className={managerStyles.infoItem}>
                <div className={managerStyles.label}>Education</div>
                <div className={managerStyles.value}>
                  <i className="fas fa-graduation-cap" style={{ marginRight: "8px", color: "#8d5f3a" }}></i>
                  {manager.education}
                </div>
              </div>

              <div className={managerStyles.infoItem}>
                <div className={managerStyles.label}>Manager Type</div>
                <div className={managerStyles.value}>
                  <i className="fas fa-briefcase" style={{ marginRight: "8px", color: "#8d5f3a" }}></i>
                  {manager.type}
                </div>
              </div>

              <div className={managerStyles.infoItem}>
                <div className={managerStyles.label}>Operating Hours</div>
                <div className={managerStyles.value}>
                  <i className="fas fa-clock" style={{ marginRight: "8px", color: "#8d5f3a" }}></i>
                  {formatOperatingHours(manager.operatingHours)}
                </div>
              </div>

              <div className={managerStyles.infoItem}>
                <div className={managerStyles.label}>Manager ID</div>
                <div className={managerStyles.value}>
                  <i className="fas fa-id-card" style={{ marginRight: "8px", color: "#8d5f3a" }}></i>
                  {manager.id}
                </div>
              </div>

              {/* Additional User Details from users API */}
              {userDetails && (
                <>
                  <div className={managerStyles.infoItem}>
                    <div className={managerStyles.label}>Age</div>
                    <div className={managerStyles.value}>
                      <i className="fas fa-birthday-cake" style={{ marginRight: "8px", color: "#8d5f3a" }}></i>
                      {userDetails.age} years
                    </div>
                  </div>

                  <div className={managerStyles.infoItem}>
                    <div className={managerStyles.label}>Gender</div>
                    <div className={managerStyles.value}>
                      <i className="fas fa-venus-mars" style={{ marginRight: "8px", color: "#8d5f3a" }}></i>
                      {userDetails.gender}
                    </div>
                  </div>

                  <div className={managerStyles.infoItem}>
                    <div className={managerStyles.label}>City</div>
                    <div className={managerStyles.value}>
                      <i className="fas fa-city" style={{ marginRight: "8px", color: "#8d5f3a" }}></i>
                      {userDetails.city}
                    </div>
                  </div>

                  <div className={managerStyles.infoItem}>
                    <div className={managerStyles.label}>User Type</div>
                    <div className={managerStyles.value}>
                      <i className="fas fa-user-tag" style={{ marginRight: "8px", color: "#8d5f3a" }}></i>
                      {userDetails.usertype}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={managerStyles.managerActions}>
            <button 
              className={managerStyles.primaryButton}
              onClick={() => {
                // Navigate to hostels managed by this manager
                navigate(`/admin/hostels?manager=${manager.id}`);
              }}
            >
              <i className="fa-solid fa-building"></i> View Hostels Managed
            </button>

            <button 
              className={managerStyles.secondaryButton}
              onClick={() => {
                // Edit manager functionality
                console.log("Edit manager:", manager.id);
                // navigate(`/admin/managers/edit/${manager.id}`);
              }}
            >
              <i className="fas fa-edit"></i> Edit Profile
            </button>

            <button 
              className={managerStyles.dangerButton}
              onClick={handleDelete}
            >
              <i className="fas fa-trash-alt"></i> Delete Manager
            </button>
          </div>
        </div>
      </div>

      {/* Font Awesome Icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" 
      />
    </div>
  );
};

export default AdminManagerProfile;