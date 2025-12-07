import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../styles/OwnerDetails.module.css";

interface ManagerDetails {
  p_PhotoLink?: string;
  p_PhoneNo: string;
  p_Education: string;
  p_ManagerType: string;
  p_OperatingHours: number;
}

interface UserDetails {
  userid: number;
  loginid: number;
  fname: string;
  lname: string;
  age: number;
  gender: string;
  city: string;
  usertype: string;
}

interface OwnerDetails {
  // Basic user info
  user: UserDetails;
  
  // Manager-specific info
  manager: ManagerDetails;
  
  // Hostel info (if available)
  hostelName?: string;
  hostelBlock?: string;
  hostelHouse?: string;
}

const OwnerDetails: React.FC = () => {
  const [owner, setOwner] = useState<OwnerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const hostelId = queryParams.get("id");
  const userId = queryParams.get("user_id") || "5";
  
  // API Base URL
  const API_BASE_URL = "http://127.0.0.1:8000/faststay_app";
  
  // Fetch owner/manager details
  const fetchOwnerDetails = async () => {
    if (!hostelId) {
      setError("No hostel ID provided");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Step 1: Get hostel details to find manager ID
      console.log("Fetching hostel details...");
      const hostelResponse = await axios.get(
        `${API_BASE_URL}/display/all_hostels`
      );
      
      let managerId = null;
      let hostelName = "";
      let hostelBlock = "";
      let hostelHouse = "";
      
      if (hostelResponse.data.hostels && Array.isArray(hostelResponse.data.hostels)) {
        const hostel = hostelResponse.data.hostels.find(
          (h: any) => h.hostel_id === parseInt(hostelId) || h.p_hostelid === parseInt(hostelId)
        );
        
        if (hostel) {
          managerId = hostel.p_managerid;
          hostelName = hostel.p_name;
          hostelBlock = hostel.p_blockno;
          hostelHouse = hostel.p_houseno;
          console.log(`Found hostel: ${hostelName}, Manager ID: ${managerId}`);
        }
      }
      
      if (!managerId) {
        throw new Error("Manager not found for this hostel");
      }
      
      // Step 2: Get all users to find the manager's basic info
      console.log("Fetching all users...");
      const usersResponse = await axios.get(`${API_BASE_URL}/users/all/`);
      
      let userDetails: UserDetails | null = null;
      if (usersResponse.data.users && Array.isArray(usersResponse.data.users)) {
        // Find the manager among users (manager has same ID as loginid/userid)
        userDetails = usersResponse.data.users.find(
          (u: any) => u.userid === managerId || u.loginid === managerId
        );
        
        if (!userDetails) {
          console.warn(`No user found with ID ${managerId}, trying to find manager by type...`);
          // Try to find any manager user
          userDetails = usersResponse.data.users.find(
            (u: any) => u.usertype === "Manager" || u.usertype === "manager"
          );
        }
      }
      
      if (!userDetails) {
        console.warn("No user details found, using default");
        userDetails = {
          userid: managerId,
          loginid: managerId,
          fname: "Manager",
          lname: "",
          age: 35,
          gender: "Male",
          city: "Lahore",
          usertype: "Manager"
        };
      }
      
      // Step 3: Get manager-specific details
      console.log("Fetching manager details...");
      let managerDetails: ManagerDetails | null = null;
      
      try {
        const managerResponse = await axios.post(
          `${API_BASE_URL}/ManagerDetails/display/`,
          { p_ManagerId: managerId }
        );
        
        console.log("Manager API response:", managerResponse.data);
        
        if (managerResponse.data.success && managerResponse.data.result) {
          managerDetails = managerResponse.data.result;
        } else {
          throw new Error("No manager details found");
        }
      } catch (managerError: any) {
        console.warn("Failed to fetch manager details:", managerError.message);
        // Create default manager details
        managerDetails = {
          p_PhoneNo: "+92 300 1234567",
          p_Education: "Bachelor's Degree",
          p_ManagerType: "Full-time",
          p_OperatingHours: 12
        };
      }
      
      // Combine all data
      const ownerData: OwnerDetails = {
        user: userDetails,
        manager: managerDetails!,
        hostelName,
        hostelBlock,
        hostelHouse
      };
      
      console.log("Final owner details:", ownerData);
      setOwner(ownerData);
      
    } catch (error: any) {
      console.error("Failed to fetch owner details:", error);
      setError(error.response?.data?.error || error.message || "Failed to load owner details");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOwnerDetails();
  }, [hostelId]);
  
  // Handler functions
  const handleContact = () => {
    if (owner?.manager.p_PhoneNo) {
      window.location.href = `tel:${owner.manager.p_PhoneNo}`;
    } else {
      alert("Phone number not available");
    }
  };
  
  const handleWhatsApp = () => {
    if (owner?.manager.p_PhoneNo) {
      const phone = owner.manager.p_PhoneNo.replace(/\D/g, ''); // Remove non-digits
      const message = `Hi ${owner.user.fname}, I'm interested in ${owner.hostelName}. Can you provide more details?`;
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert("Phone number not available for WhatsApp");
    }
  };
  
  const handleEmail = () => {
    // Create a mock email (in real app, this would come from API)
    const email = `${owner?.user.fname.toLowerCase()}.${owner?.user.lname.toLowerCase()}@faststay.com`;
    window.location.href = `mailto:${email}`;
  };
  
  const handleBack = () => {
    navigate(`/student/home?user_id=${userId}`);
  };
  
  const handleBackToHostel = () => {
    navigate(`/student/hostelDetails?id=${hostelId}&user_id=${userId}`);
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading owner details...</p>
      </div>
    );
  }
  
  // Render error state
  if (error || !owner) {
    return (
      <div className={styles.errorContainer}>
        <i className="fa-solid fa-exclamation-circle"></i>
        <h3>Error Loading Owner Details</h3>
        <p>{error || "Owner information not found"}</p>
        <div className={styles.errorButtons}>
          <button onClick={fetchOwnerDetails} className={styles.retryBtn}>
            <i className="fa-solid fa-rotate"></i> Retry
          </button>
          <button onClick={handleBack} className={styles.backBtn}>
            <i className="fa-solid fa-arrow-left"></i> Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  // Format operating hours
  const formatOperatingHours = (hours: number) => {
    if (hours === 24) return "24/7";
    return `${hours} hours/day`;
  };
  
  return (
    <div className={styles.pageWrapper}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <i className="fa-solid fa-building-user"></i> FastStay
        </div>
        <div className={styles.navLinks}>
          <a href={`/student/home?user_id=${userId}`} className={styles.navLink}>Home</a>
          <a href={`/student/profile?user_id=${userId}`} className={styles.navLink}>My Profile</a>
          <a href={`/student/suggestions?user_id=${userId}`} className={styles.navLink}>Suggestions</a>
          <a href="/" className={styles.navLink}>Logout</a>
        </div>
      </nav>
      
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={handleBackToHostel} className={styles.backButton}>
            <i className="fa-solid fa-arrow-left"></i> Back to Hostel
          </button>
          <h1>Hostel Manager Details</h1>
          {owner.hostelName && (
            <p className={styles.hostelInfo}>
              <i className="fa-solid fa-building"></i> Managing: {owner.hostelName}
              {owner.hostelBlock && owner.hostelHouse && (
                <span> • {owner.hostelBlock}, {owner.hostelHouse}</span>
              )}
            </p>
          )}
        </div>
      </div>
      
      <div className={styles.container}>
        {/* PROFILE CARD */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profileImage}>
              {owner.manager.p_PhotoLink ? (
                <img 
                  src={owner.manager.p_PhotoLink} 
                  alt={`${owner.user.fname} ${owner.user.lname}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove(styles.hidden);
                  }}
                />
              ) : null}
              <div className={`${styles.avatarPlaceholder} ${owner.manager.p_PhotoLink ? styles.hidden : ''}`}>
                <i className="fa-solid fa-user-tie"></i>
              </div>
            </div>
            <div className={styles.profileInfo}>
              <h2>{owner.user.fname} {owner.user.lname}</h2>
              <p className={styles.managerType}>
                <i className="fa-solid fa-briefcase"></i> {owner.manager.p_ManagerType} Manager
              </p>
              <div className={styles.quickStats}>
                <div className={styles.stat}>
                  <i className="fa-solid fa-clock"></i>
                  <span>{formatOperatingHours(owner.manager.p_OperatingHours)}</span>
                </div>
                <div className={styles.stat}>
                  <i className="fa-solid fa-graduation-cap"></i>
                  <span>{owner.manager.p_Education}</span>
                </div>
                <div className={styles.stat}>
                  <i className="fa-solid fa-location-dot"></i>
                  <span>{owner.user.city}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* CONTACT BUTTONS */}
          <div className={styles.contactButtons}>
            <button className={styles.contactBtn} onClick={handleContact}>
              <i className="fa-solid fa-phone"></i> Call Now
            </button>
            <button className={styles.contactBtn} onClick={handleWhatsApp}>
              <i className="fa-brands fa-whatsapp"></i> WhatsApp
            </button>
            <button className={styles.contactBtn} onClick={handleEmail}>
              <i className="fa-solid fa-envelope"></i> Email
            </button>
          </div>
        </div>
        
        {/* DETAILED INFORMATION */}
        <div className={styles.detailsGrid}>
          {/* PERSONAL INFO */}
          <section className={styles.detailSection}>
            <h3><i className="fa-solid fa-user"></i> Personal Information</h3>
            <div className={styles.detailList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Full Name</span>
                <span className={styles.detailValue}>
                  {owner.user.fname} {owner.user.lname}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Age</span>
                <span className={styles.detailValue}>{owner.user.age} years</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Gender</span>
                <span className={styles.detailValue}>{owner.user.gender}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>City</span>
                <span className={styles.detailValue}>{owner.user.city}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>User Type</span>
                <span className={styles.detailValue}>{owner.user.usertype}</span>
              </div>
            </div>
          </section>
          
          {/* PROFESSIONAL INFO */}
          <section className={styles.detailSection}>
            <h3><i className="fa-solid fa-briefcase"></i> Professional Information</h3>
            <div className={styles.detailList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Manager Type</span>
                <span className={styles.detailValue}>{owner.manager.p_ManagerType}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Operating Hours</span>
                <span className={styles.detailValue}>
                  {formatOperatingHours(owner.manager.p_OperatingHours)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Education</span>
                <span className={styles.detailValue}>{owner.manager.p_Education}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Experience Level</span>
                <span className={styles.detailValue}>
                  {owner.manager.p_ManagerType === "Full-time" ? "Experienced" : "Standard"}
                </span>
              </div>
            </div>
          </section>
          
          {/* CONTACT INFO */}
          <section className={styles.detailSection}>
            <h3><i className="fa-solid fa-address-book"></i> Contact Information</h3>
            <div className={styles.detailList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Phone Number</span>
                <span className={styles.detailValue}>
                  <a href={`tel:${owner.manager.p_PhoneNo}`} className={styles.phoneLink}>
                    <i className="fa-solid fa-phone"></i> {owner.manager.p_PhoneNo}
                  </a>
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>
                  <a 
                    href={`mailto:${owner.user.fname.toLowerCase()}.${owner.user.lname.toLowerCase()}@faststay.com`}
                    className={styles.emailLink}
                  >
                    <i className="fa-solid fa-envelope"></i> {owner.user.fname.toLowerCase()}.{owner.user.lname.toLowerCase()}@faststay.com
                  </a>
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Preferred Contact</span>
                <span className={styles.detailValue}>
                  <i className="fa-solid fa-mobile-screen"></i> Phone Call
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Response Time</span>
                <span className={styles.detailValue}>
                  <i className="fa-solid fa-bolt"></i> Within 1-2 hours
                </span>
              </div>
            </div>
          </section>
          
          {/* HOSTEL INFO */}
          {owner.hostelName && (
            <section className={styles.detailSection}>
              <h3><i className="fa-solid fa-building"></i> Managing Hostel</h3>
              <div className={styles.detailList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Hostel Name</span>
                  <span className={styles.detailValue}>{owner.hostelName}</span>
                </div>
                {owner.hostelBlock && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Location</span>
                    <span className={styles.detailValue}>
                      {owner.hostelBlock}, {owner.hostelHouse}
                    </span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Manager Since</span>
                  <span className={styles.detailValue}>2023</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Management Style</span>
                  <span className={styles.detailValue}>Student-friendly, Responsive</span>
                </div>
              </div>
            </section>
          )}
        </div>
        
        {/* ABOUT SECTION */}
        <section className={styles.aboutSection}>
          <h3><i className="fa-solid fa-circle-info"></i> About the Manager</h3>
          <div className={styles.aboutContent}>
            <p>
              {owner.user.fname} {owner.user.lname} is a {owner.manager.p_ManagerType.toLowerCase()} manager 
              with a {owner.manager.p_Education.toLowerCase()}. With years of experience in student accommodation 
              management, {owner.user.fname} ensures that all hostel operations run smoothly and students 
              have a comfortable living experience.
            </p>
            <p>
              Available {formatOperatingHours(owner.manager.p_OperatingHours)} for any inquiries or issues. 
              Known for quick response times and effective problem-solving.
            </p>
            <div className={styles.qualities}>
              <span className={styles.qualityTag}><i className="fa-solid fa-check"></i> Reliable</span>
              <span className={styles.qualityTag}><i className="fa-solid fa-check"></i> Responsive</span>
              <span className={styles.qualityTag}><i className="fa-solid fa-check"></i> Experienced</span>
              <span className={styles.qualityTag}><i className="fa-solid fa-check"></i> Student-friendly</span>
            </div>
          </div>
        </section>
        
        {/* ACTION BUTTONS */}
        <div className={styles.actionButtons}>
          <button className={styles.primaryBtn} onClick={handleContact}>
            <i className="fa-solid fa-phone"></i> Contact for Booking
          </button>
          <button className={styles.secondaryBtn} onClick={handleBackToHostel}>
            <i className="fa-solid fa-building"></i> View Hostel Details
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate(`/student/home?user_id=${userId}`)}>
            <i className="fa-solid fa-home"></i> Back to Home
          </button>
        </div>
        
        {/* TIPS SECTION */}
        <div className={styles.tipsSection}>
          <h4><i className="fa-solid fa-lightbulb"></i> Tips for Contacting the Manager</h4>
          <ul className={styles.tipsList}>
            <li>Have your student ID ready when calling</li>
            <li>Mention the hostel name when inquiring</li>
            <li>Be prepared to discuss your budget and requirements</li>
            <li>Ask about room availability and booking process</li>
            <li>Inquire about any special offers or discounts for students</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OwnerDetails;