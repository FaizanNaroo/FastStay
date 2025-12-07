import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Suggestions.module.css";

interface Hostel {
  p_hostelid: number;
  p_name: string;
  p_blockno: string;
  p_houseno: string;
  p_hosteltype: string;
  p_isparking: boolean;
  p_numrooms: number;
  p_numfloors: number;
  p_watertimings: string;
  p_cleanlinesstenure: number;
  p_issueresolvingtenure: number;
  p_messprovide: boolean;
  p_geezerflag: boolean;
  monthly_rent: number;
  available_rooms: number;
  rating: number;
  distance_from_university: number;
  images?: string;
}

interface StudentProfile {
  p_Semester: number;
  p_Department: string;
  p_Batch: number;
  p_RoomateCount: number;
  p_UniDistance: number;
  p_isAcRoom: boolean;
  p_isMess: boolean;
  p_BedType: string;
  p_WashroomType: string;
}

// Helper function to display values with N/A for -1
const formatValue = (value: number, options?: {
  prefix?: string;
  suffix?: string;
  decimals?: number;
  isCurrency?: boolean;
  isDistance?: boolean;
}): string => {
  if (value === -1) return "N/A";
  
  let displayValue = value;
  
  // Apply decimal places if specified
  if (options?.decimals !== undefined) {
    displayValue = parseFloat(displayValue.toFixed(options.decimals));
  }
  
  // Format as currency if needed
  if (options?.isCurrency) {
    return `${options.prefix || ''}${displayValue.toLocaleString()}${options.suffix || ' PKR'}`;
  }
  
  // Format as distance if needed
  if (options?.isDistance) {
    return `${displayValue.toFixed(1)}${options.suffix || ' km'}`;
  }
  
  // Default formatting
  return `${options?.prefix || ''}${displayValue}${options?.suffix || ''}`;
};

// Helper for ratings specifically
const formatRating = (rating: number): string => {
  if (rating === -1) return "N/A";
  return `${rating.toFixed(1)}/5.0`;
};

// Helper for rooms specifically
const formatRooms = (rooms: number): string => {
  if (rooms === -1) return "N/A";
  return `${rooms}`;
};

const Suggestions: React.FC = () => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [improvements, setImprovements] = useState("");
  const [defects, setDefects] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Hostel[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("user_id") || '';
  const navigate = useNavigate();

  const fetchStudentProfile = async (): Promise<StudentProfile | null> => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/faststay_app/UserDetail/display/",
        { p_StudentId: parseInt(userId) }
      );
      
      if (response.data.success) {
        console.log("Student profile loaded:", response.data.result);
        return response.data.result;
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch student profile:", error);
      return null;
    }
  };

  const fetchAllHostels = async (): Promise<Hostel[]> => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/faststay_app/display/all_hostels"
      );
      
      if (response.data.hostels && Array.isArray(response.data.hostels)) {
        console.log("Hostels loaded:", response.data.hostels);
        return response.data.hostels.slice(0, 3); // Take first 3 for demo
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch hostels:", error);
      return [];
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    
    try {
      const [profileData, hostelsData] = await Promise.all([
        fetchStudentProfile(),
        fetchAllHostels()
      ]);

      setProfile(profileData);
      
      // Enhance hostels with additional data
      const enhancedHostels = await Promise.all(
        hostelsData.map(async (hostel: any) => {
          try {
            // Get images
            let images: string = '';
            try {
              const imagesResponse = await axios.get(
                `http://127.0.0.1:8000/faststay_app/display/hostel_pic?p_HostelId=${hostel.p_hostelid}`
              );
              
              console.log(`Photos of Hostel ${hostel.p_hostelid}:`, imagesResponse.data[0].p_photolink)
              if (imagesResponse.data && imagesResponse.data[0].p_photolink) {
                const photoLink = imagesResponse.data[0].p_photolink;
                images = photoLink;
              }
            } catch (imgError) {
              // Use default image
              images = '';
            }
            
            // Get expenses for rent
            let monthly_rent = -1;
            let available_rooms = -1;
            try {
              const expensesResponse = await axios.post(
                `http://127.0.0.1:8000/faststay_app/Expenses/display/`,
                { p_HostelId: hostel.p_hostelid }
              );
              
              if (expensesResponse.data.result && expensesResponse.data.result.RoomCharges && 
                  expensesResponse.data.result.RoomCharges.length > 0) {
                monthly_rent = expensesResponse.data.result.RoomCharges[0];
                
                // Generate random available rooms: 30% chance of N/A (-1), else random 0-20
                const randomValue = Math.random();
                if (randomValue < 0.3) {
                  // 30% chance: N/A
                  available_rooms = -1;
                } else {
                  // 70% chance: Random number 0-20
                  available_rooms = Math.floor(Math.random() * 21);
                }
              } else {
                // Default mock data for available rooms
                available_rooms = Math.floor(Math.random() * 21);
              }
            } catch (expError) {
              // Default mock data for available rooms
              available_rooms = Math.floor(Math.random() * 21);
            }
            
            // Get rating
            let rating = -1;
            try {
              const ratingsResponse = await axios.get(
                `http://127.0.0.1:8000/faststay_app/display/hostel_rating`
              );
              
              if (ratingsResponse.data?.ratings) {
                const hostelRatings = ratingsResponse.data.ratings.filter(
                  (r: any) => r.p_hostelid === hostel.p_hostelid || r.p_hostelid === hostel.p_hostelid
                );
                
                if (hostelRatings.length > 0) {
                  const total = hostelRatings.reduce((sum: number, r: any) => 
                    sum + (r.p_ratingstar || r.rating || 0), 0);
                  rating = parseFloat((total / hostelRatings.length).toFixed(1));
                }
              }
            } catch (ratingError) {
              // Keep as -1
            }
            
            return {
              ...hostel,
              images,
              monthly_rent,
              available_rooms,
              rating,
              distance_from_university: hostel.distance_from_university || -1
            };
          } catch (error) {
            console.error(`Error enhancing hostel ${hostel.p_hostelid}:`, error);
            return {
              ...hostel,
              images: '',
              monthly_rent: -1,
              available_rooms: Math.floor(Math.random() * 21),
              rating: -1,
              distance_from_university: -1
            };
          }
        })
      );
      
      setRecommendations(enhancedHostels);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, [userId]);

  const handleSubmitFeedback = async () => {
    if (!improvements.trim() && !defects.trim()) {
      setFeedbackMessage("Please provide at least one suggestion or defect report.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);
    setFeedbackMessage(null);

    try {
      const feedbackData = {
        p_UserId: parseInt(userId),
        p_Improvements: improvements,
        p_Defects: defects
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/faststay_app/AppSuggestion/add/",
        feedbackData
      );

      if (response.data.success) {
        setFeedbackMessage("Thank you for your feedback! We appreciate your suggestions.");
        setMessageType("success");
        setImprovements("");
        setDefects("");
        setTimeout(() => {
          setFeedbackModalOpen(false);
          setFeedbackMessage(null);
        }, 2000);
      } else {
        setFeedbackMessage(response.data.message || "Failed to submit feedback.");
        setMessageType("error");
      }
    } catch (err: any) {
      console.error("Feedback submission error:", err);
      if (err.response) {
        setFeedbackMessage(err.response.data?.detail || err.response.data?.message || "Server error occurred.");
      } else if (err.request) {
        setFeedbackMessage("No response from server. Please check your connection.");
      } else {
        setFeedbackMessage("Failed to submit feedback. Please try again.");
      }
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewHostelDetails = (hostelId: number) => {
    navigate(`/student/hostelDetails?id=${hostelId}&user_id=${userId}`);
  };

  const handleViewAllHostels = () => {
    navigate(`/student/home?user_id=${userId}`);
  };

  const getMatchScore = (hostel: Hostel): number => {
    if (!profile) return 75;
    
    let score = 75; // Base score
    
    // Adjust based on mess preference
    if (profile.p_isMess === hostel.p_messprovide) {
      score += 15;
    }
    
    // Adjust based on distance preference
    if (hostel.distance_from_university !== -1 && hostel.distance_from_university <= profile.p_UniDistance) {
      score += 10;
    }
    
    // Bonus for good rating
    if (hostel.rating !== -1 && hostel.rating >= 4.0) {
      score += 10;
    }
    
    // Cap at 100
    return Math.min(100, score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "#4CAF50";
    if (score >= 70) return "#FF9800";
    return "#F44336";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 85) return "Excellent Match";
    if (score >= 70) return "Good Match";
    return "Fair Match";
  };

  return (
    <div className={styles.pageWrapper}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <i className="fa-solid fa-building-user"></i> FastStay
        </div>
        <div className={styles.navLinks}>
          <Link to={`/student/home?user_id=${userId}`} className={styles.navLinkItem}>
            Home
          </Link>
          <Link to={`/student/profile?user_id=${userId}`} className={styles.navLinkItem}>
            My Profile
          </Link>
          <Link to={`/suggestions?user_id=${userId}`} className={`${styles.navLinkItem} ${styles.active}`}>
            Suggestions
          </Link>
          <button 
            className={styles.feedbackBtn}
            onClick={() => setFeedbackModalOpen(true)}
          >
            <i className="fa-solid fa-comment-medical"></i> Feedback
          </button>
          <Link to="/" className={styles.navLinkItem}>
            Logout
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className={styles.mainContainer}>
        {/* HERO SECTION */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <i className="fa-solid fa-wand-magic-sparkles"></i> Your Personalized Recommendations
            </h1>
            <p className={styles.heroSubtitle}>
              AI-powered hostel suggestions tailored to your preferences and profile
            </p>
          </div>
        </div>

        {/* PROFILE SUMMARY */}
        {profile && (
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h2><i className="fa-solid fa-user-graduate"></i> Your Profile</h2>
            </div>
            <div className={styles.profileGrid}>
              <div className={styles.profileCard}>
                <div className={styles.profileIcon}>
                  <i className="fa-solid fa-building-columns"></i>
                </div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileLabel}>Department</span>
                  <span className={styles.profileValue}>{profile.p_Department}</span>
                </div>
              </div>
              <div className={styles.profileCard}>
                <div className={styles.profileIcon}>
                  <i className="fa-solid fa-layer-group"></i>
                </div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileLabel}>Semester</span>
                  <span className={styles.profileValue}>{profile.p_Semester}</span>
                </div>
              </div>
              <div className={styles.profileCard}>
                <div className={styles.profileIcon}>
                  <i className="fa-solid fa-utensils"></i>
                </div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileLabel}>Mess Required</span>
                  <span className={styles.profileValue}>{profile.p_isMess ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className={styles.profileCard}>
                <div className={styles.profileIcon}>
                  <i className="fa-solid fa-bed"></i>
                </div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileLabel}>Bed Type</span>
                  <span className={styles.profileValue}>{profile.p_BedType}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RECOMMENDATIONS SECTION */}
        <div className={styles.recommendationsSection}>
          <div className={styles.sectionHeader}>
            <h2><i className="fa-solid fa-ranking-star"></i> Top Recommendations</h2>
            <button 
              className={styles.viewAllBtn}
              onClick={handleViewAllHostels}
            >
              <i className="fa-solid fa-list"></i> View All Hostels
            </button>
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Finding the best hostels for you...</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className={styles.noRecommendations}>
              <i className="fa-solid fa-search"></i>
              <h3>No Recommendations Found</h3>
              <p>We couldn't find hostels matching your profile. Try updating your preferences.</p>
              <Link to={`/student/profile?user_id=${userId}`} className={styles.updateProfileBtn}>
                <i className="fa-solid fa-edit"></i> Update Profile
              </Link>
            </div>
          ) : (
            <>
              <p className={styles.recommendationsDescription}>
                Based on your profile, we've selected these hostels as the best matches for you
              </p>
              
              <div className={styles.recommendationsGrid}>
                {recommendations.map((hostel, index) => {
                  const matchScore = getMatchScore(hostel);
                  const scoreColor = getScoreColor(matchScore);
                  
                  return (
                    <div key={hostel.p_hostelid} className={styles.recommendationCard}>
                      <div className={styles.cardHeader}>
                        <div className={styles.rankBadge}>
                          <i className="fa-solid fa-crown"></i> #{index + 1}
                        </div>
                        <div 
                          className={styles.scoreBadge}
                          style={{ backgroundColor: scoreColor }}
                        >
                          {matchScore}% Match
                        </div>
                      </div>

                      <div className={styles.cardImage}>
                        <img 
                          src={hostel.images && hostel.images.length > 0 
                            ? hostel.images 
                            : `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80`
                          } 
                          alt={hostel.p_name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80`;
                          }}
                        />
                        <div className={styles.imageOverlay}>
                          <div className={styles.matchLabel}>
                            <i className="fa-solid fa-heart"></i> {getMatchLabel(matchScore)}
                          </div>
                        </div>
                      </div>

                      <div className={styles.cardContent}>
                        <h3 className={styles.hostelName}>{hostel.p_name}</h3>
                        
                        <div className={styles.locationInfo}>
                          <i className="fa-solid fa-location-dot"></i>
                          <span>Block {hostel.p_blockno}, House {hostel.p_houseno}</span>
                          {hostel.distance_from_university !== -1 && (
                            <span className={styles.distanceBadge}>
                              {formatValue(hostel.distance_from_university, { isDistance: true })}
                            </span>
                          )}
                        </div>

                        <div className={styles.hostelStats}>
                          <div className={styles.statItem}>
                            <div className={styles.statIcon}>
                              <i className="fa-solid fa-money-bill-wave"></i>
                            </div>
                            <div className={styles.statContent}>
                              <span className={styles.statLabel}>Monthly Rent</span>
                              <span className={styles.statValue}>
                                {formatValue(hostel.monthly_rent, { isCurrency: true })}
                              </span>
                            </div>
                          </div>
                          
                          <div className={styles.statItem}>
                            <div className={styles.statIcon}>
                              <i className="fa-solid fa-star"></i>
                            </div>
                            <div className={styles.statContent}>
                              <span className={styles.statLabel}>Rating</span>
                              <span className={styles.statValue}>
                                {formatRating(hostel.rating)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.hostelFeatures}>
                          {hostel.p_messprovide && (
                            <span className={`${styles.featureTag} ${styles.messTag}`}>
                              <i className="fa-solid fa-utensils"></i> Mess
                            </span>
                          )}
                          {hostel.p_isparking && (
                            <span className={`${styles.featureTag} ${styles.parkingTag}`}>
                              <i className="fa-solid fa-car"></i> Parking
                            </span>
                          )}
                          {hostel.p_geezerflag && (
                            <span className={`${styles.featureTag} ${styles.geyserTag}`}>
                              <i className="fa-solid fa-fire"></i> Geyser
                            </span>
                          )}
                          <span className={`${styles.featureTag} ${styles.typeTag}`}>
                            <i className="fa-solid fa-building"></i> {hostel.p_hosteltype}
                          </span>
                        </div>

                        <div className={styles.cardActions}>
                          <button
                            className={styles.viewDetailsBtn}
                            onClick={() => handleViewHostelDetails(hostel.p_hostelid)}
                          >
                            <i className="fa-solid fa-eye"></i> View Details
                          </button>
                          <span className={styles.roomsAvailable}>
                            <i className="fa-solid fa-door-closed"></i> {formatRooms(hostel.available_rooms)} rooms left
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* FEEDBACK SECTION */}
        <div className={styles.feedbackSection}>
          <div className={styles.feedbackCard}>
            <div className={styles.feedbackIcon}>
              <i className="fa-solid fa-bullhorn"></i>
            </div>
            <div className={styles.feedbackContent}>
              <h3>Help Us Improve FastStay</h3>
              <p>Your feedback is valuable in making our platform better for all students</p>
            </div>
            <button 
              className={styles.feedbackActionBtn}
              onClick={() => setFeedbackModalOpen(true)}
            >
              <i className="fa-solid fa-pen-to-square"></i> Share Feedback
            </button>
          </div>
        </div>
      </div>

      {/* FEEDBACK MODAL */}
      {feedbackModalOpen && (
        <div className={styles.modalOverlay} onClick={() => !submitting && setFeedbackModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3><i className="fa-solid fa-comment-medical"></i> Share Your Feedback</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => !submitting && setFeedbackModalOpen(false)}
                disabled={submitting}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {feedbackMessage && (
                <div className={`${styles.message} ${styles[messageType]}`}>
                  <i className={`fa-solid ${messageType === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
                  {feedbackMessage}
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label htmlFor="improvements">
                  <i className="fa-solid fa-lightbulb"></i> Suggestions for Improvements
                </label>
                <textarea
                  id="improvements"
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  placeholder="What features would you like to see improved or added? What would make your experience better?"
                  rows={4}
                  disabled={submitting}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="defects">
                  <i className="fa-solid fa-bug"></i> Report Defects or Issues
                </label>
                <textarea
                  id="defects"
                  value={defects}
                  onChange={(e) => setDefects(e.target.value)}
                  placeholder="Any bugs, issues, or problems you've encountered while using FastStay?"
                  rows={4}
                  disabled={submitting}
                />
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button
                className={`${styles.modalBtn} ${styles.cancelBtn}`}
                onClick={() => !submitting && setFeedbackModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className={`${styles.modalBtn} ${styles.submitBtn}`}
                onClick={handleSubmitFeedback}
                disabled={submitting || (!improvements.trim() && !defects.trim())}
              >
                {submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Submitting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i> Submit Feedback
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suggestions;