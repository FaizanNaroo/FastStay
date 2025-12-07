import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getHostelDetails, type HostelTableRow } from "../api/admin_hostels_review";
import styles from "../styles/admin_dashboard.module.css";
import "../AdminViewHostels.css";

const AdminViewHostels: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get hostel ID from URL
  const [hostel, setHostel] = useState<HostelTableRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        setLoading(true);
        const hostelId = parseInt(id || "0");
        // Use the new getHostelDetails function which fetches pictures separately
        const hostelDetails = await getHostelDetails(hostelId);
        
        if (hostelDetails) {
          setHostel(hostelDetails);
          // Set the first image as selected if available
          if (hostelDetails.photos && hostelDetails.photos.length > 0) {
            setSelectedImage(hostelDetails.photos[0]);
          }
        } else {
          setError("Hostel not found");
        }
      } catch (err) {
        setError("Failed to load hostel details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHostel();
  }, [id]);

  const handleNextImage = () => {
    if (hostel?.photos && hostel.photos.length > 0) {
      const nextIndex = (currentImageIndex + 1) % hostel.photos.length;
      setCurrentImageIndex(nextIndex);
      setSelectedImage(hostel.photos[nextIndex]);
    }
  };

  const handlePrevImage = () => {
    if (hostel?.photos && hostel.photos.length > 0) {
      const prevIndex = (currentImageIndex - 1 + hostel.photos.length) % hostel.photos.length;
      setCurrentImageIndex(prevIndex);
      setSelectedImage(hostel.photos[prevIndex]);
    }
  };

  const handleThumbnailClick = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  // Show only error on full page if there's a critical error
  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        <h2>{error}</h2>
        <Link to="/admin/hostels" style={{ color: "#f8f3e7", textDecoration: "underline" }}>
          Go back to all hostels
        </Link>
      </div>
    );
  }

  return (
    <>
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
            <Link to="/admin/managers">Managers</Link>
            <Link to="/admin/logout">Logout</Link>
          </div>
        </nav>

        <div className={styles.container}>
          {/* Back button */}
          <div style={{ marginBottom: "20px" }}>
            <Link 
              to="/admin/hostels"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                backgroundColor: "#5c3d2e",
                color: "#f8f3e7",
                textDecoration: "none",
                borderRadius: "8px",
                marginBottom: "20px"
              }}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to All Hostels
            </Link>
          </div>

          {/* Loading state within the page */}
          {loading ? (
            <div className="custom-card">
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center",
                padding: "60px 20px",
                textAlign: "center"
              }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ 
                  fontSize: "24px", 
                  marginBottom: "15px",
                  color: "#5c3d2e"
                }}></i>
                <h3 style={{ marginBottom: "10px", color: "#5c3d2e" }}>Loading hostel details...</h3>
                <p style={{ color: "#666" }}>Please wait while we fetch the hostel information</p>
              </div>
            </div>
          ) : !hostel ? (
            <div className="custom-card">
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center",
                padding: "60px 20px",
                textAlign: "center"
              }}>
                <i className="fa-solid fa-building" style={{ 
                  fontSize: "32px", 
                  marginBottom: "15px",
                  color: "#999"
                }}></i>
                <h3 style={{ marginBottom: "10px", color: "#666" }}>No hostel data available</h3>
                <p style={{ color: "#666", marginBottom: "20px" }}>The requested hostel could not be found</p>
                <Link 
                  to="/admin/hostels"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    backgroundColor: "#5c3d2e",
                    color: "#f8f3e7",
                    textDecoration: "none",
                    borderRadius: "8px"
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i> Go back to all hostels
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2 className="custom-title">
                <i className="fa-solid fa-building-circle-check"></i> Review Hostel: {hostel.name}
              </h2>
              <p className="custom-subtitle">
                Hostel ID: {hostel.id} | Verify details before approval.
              </p>

              <div className="custom-card" key={hostel.id}>
                {/* HOSTEL BASIC INFO */}
                <h3 className="custom-section-title">Hostel Information</h3>
                <div className="custom-info-grid">
                  <div className="custom-info-box">
                    <div className="custom-info-label">Google Map Location</div>
                    <div className="custom-info-value">
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(`${hostel.houseNo} ${hostel.blockNo}`)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Open in Maps
                      </a>
                    </div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Type</div>
                    <div className="custom-info-value">{hostel.type}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Block No</div>
                    <div className="custom-info-value">{hostel.blockNo}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">House No</div>
                    <div className="custom-info-value">{hostel.houseNo}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Parking Available</div>
                    <div className="custom-info-value">{hostel.parking ? "Yes" : "No"}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Mess Provide</div>
                    <div className="custom-info-value">{hostel.messProvide ? "Yes" : "No"}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Geezer Available</div>
                    <div className="custom-info-value">{hostel.geezer ? "Yes" : "No"}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Number of Rooms</div>
                    <div className="custom-info-value">{hostel.rooms}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Number of Floors</div>
                    <div className="custom-info-value">{hostel.floors}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Water Timings</div>
                    <div className="custom-info-value">{hostel.waterTimings}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Cleanliness Tenure</div>
                    <div className="custom-info-value">{hostel.cleanlinessTenure}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Issue Resolving Tenure</div>
                    <div className="custom-info-value">{hostel.issueResolvingTenure}</div>
                  </div>
                </div>

                {/* ENHANCED PICTURE GALLERY */}
                <h3 className="custom-section-title">Hostel Pictures</h3>
                {hostel.photos && hostel.photos.length > 0 ? (
                  <div className="custom-image-gallery">
                    {/* Main Image Display */}
                    <div className="custom-main-image-container">
                      <div className="custom-image-counter">
                        {currentImageIndex + 1} / {hostel.photos.length}
                      </div>
                      <img 
                        src={selectedImage || hostel.photos[0]} 
                        alt={`${hostel.name} - Main view`}
                        className="custom-main-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x500?text=Image+Not+Available";
                        }}
                      />
                      
                      {/* Navigation Arrows (only show if more than 1 image) */}
                      {hostel.photos.length > 1 && (
                        <>
                          <button 
                            className="custom-nav-btn custom-prev-btn"
                            onClick={handlePrevImage}
                          >
                            <i className="fa-solid fa-chevron-left"></i>
                          </button>
                          <button 
                            className="custom-nav-btn custom-next-btn"
                            onClick={handleNextImage}
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Grid */}
                    <div className="custom-thumbnail-grid">
                      {hostel.photos.map((photo, idx) => (
                        <div 
                          key={idx} 
                          className={`custom-thumbnail-container ${currentImageIndex === idx ? 'custom-thumbnail-active' : ''}`}
                          onClick={() => handleThumbnailClick(photo, idx)}
                        >
                          <img 
                            src={photo} 
                            alt={`${hostel.name} - Thumbnail ${idx + 1}`} 
                            className="custom-thumbnail"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/100x80?text=Thumb";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="custom-no-images">
                    <img 
                      src="https://via.placeholder.com/600x400?text=No+Images+Available" 
                      alt="No images available"
                      className="custom-placeholder-image"
                    />
                    <p>No pictures available for this hostel</p>
                  </div>
                )}

                {/* MANAGER INFO */}
                <h3 className="custom-section-title">Hostel Manager Information</h3>
                <div className="custom-info-grid">
                  <div className="custom-info-box">
                    <div className="custom-info-label">Name</div>
                    <div className="custom-info-value">{hostel.managerName}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Phone</div>
                    <div className="custom-info-value">{hostel.managerPhone}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Manager Education</div>
                    <div className="custom-info-value">{hostel.managerEducation}</div>
                  </div>

                  <div className="custom-info-box">
                    <div className="custom-info-label">Manager Type</div>
                    <div className="custom-info-value">{hostel.managerType}</div>
                  </div>
                </div>

                {/* APPROVAL BUTTONS */}
                <div className="custom-btn-row">
                  <button 
                    className="custom-btn custom-btn-approve"
                    onClick={() => {
                      // Add your approve logic here
                      console.log(`Approving hostel ${hostel.id}`);
                    }}
                  >
                    <i className="fa-solid fa-check"></i> Approve
                  </button>
                  <button 
                    className="custom-btn custom-btn-reject"
                    onClick={() => {
                      // Add your reject logic here
                      console.log(`Rejecting hostel ${hostel.id}`);
                    }}
                  >
                    <i className="fa-solid fa-times"></i> Reject
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminViewHostels;