import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../styles/HostelDetails.module.css";

interface RoomType {
  type: string;
  rent: number;
  available: number;
}

interface Rating {
  p_RatingId: number;
  p_HostelId: number;
  p_StudentId: number;
  p_RatingStar: number;
  p_MaintenanceRating: number;
  p_IssueResolvingRate: number;
  p_ManagerBehaviour: number;
  p_Challenges: string;
}

interface Expense {
  p_isIncludedInRoomCharges: boolean;
  p_RoomCharges: number[];
  p_SecurityCharges: number;
  p_MessCharges: number;
  p_KitchenCharges: number;
  p_InternetCharges: number;
  p_AcServiceCharges: number;
  p_ElectricitybillType: string;
  p_ElectricityCharges: number;
}

interface HostelImage {
  p_PhotoLink: string;
}

interface HostelDetails {
  hostel_id: number;
  p_name: string;
  p_blockno: string;
  p_houseno: string;
  distance_from_university?: number;
  images: HostelImage[];
  
  // Room types
  rooms: RoomType[];
  
  // Ratings
  ratings: Rating[];
  averageRating?: number;
  
  // Expenses
  expenses: Expense | null;
  
  // Services
  services: string[];
  
  // Mess details
  mess_charges?: number;
  mess_description?: string;
  
  // Kitchen details
  kitchen_facilities: string[];
  
  // Additional expenses
  electricity_charges?: string;
  security_deposit?: number;
  maintenance_charges?: number;
  wifi_included: boolean;
}

const HostelDetails: React.FC = () => {
  const [hostel, setHostel] = useState<HostelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const hostelId = queryParams.get("id");
  const userId = queryParams.get("user_id") || "5";
  
  // API Base URL
  const API_BASE_URL = "http://127.0.0.1:8000/faststay_app";
  
  // Helper function to calculate average rating from ratings data
  const calculateAverageRating = (ratings: Rating[]): number => {
    if (!ratings || ratings.length === 0) return 0;
    
    const total = ratings.reduce((sum, rating) => sum + rating.p_RatingStar, 0);
    return parseFloat((total / ratings.length).toFixed(1));
  };
  
  // Helper function to get hostel images - SIMPLIFIED VERSION
  const getHostelImages = async (hostelId: number): Promise<HostelImage[]> => {
    try {
      console.log(`Fetching images for hostel ${hostelId}`);
      const response = await axios.get(
        `${API_BASE_URL}/display/hostel_pic?p_HostelId=${hostelId}`
      );
      
      console.log(`Images API response for hostel ${hostelId}:`, response.data);
      
      // Based on your example URL, the API returns a single object with p_photolink
      const imageData = response.data;
      
      // Check if we have a photo link
      if (imageData && imageData.p_photolink) {
        const photoLink = imageData.p_photolink;
        // Return as array with one image
        return [{ p_PhotoLink: photoLink }];
      }
      // Alternative field name
      else if (imageData && imageData.p_PhotoLink) {
        const photoLink = imageData.p_PhotoLink;
        return [{ p_PhotoLink: photoLink }];
      }
      // If it's already an array
      else if (Array.isArray(imageData)) {
        return imageData
          .filter((img: any) => img.p_photolink || img.p_PhotoLink)
          .map((img: any) => ({
            p_PhotoLink: img.p_photolink || img.p_PhotoLink
          }));
      }
      
      console.warn(`No p_photolink found for hostel ${hostelId}`);
      return [];
      
    } catch (error: any) {
      // Check if it's a 404 (no image for this hostel)
      if (error.response?.status === 404) {
        console.log(`No images found for hostel ${hostelId} (expected)`);
        return [];
      }
      
      console.error(`Failed to fetch images for hostel ${hostelId}:`, 
        error.response?.data || error.message
      );
      return [];
    }
  };

  // Helper to get hostel ratings
  const getHostelRatings = async (hostelId: number): Promise<Rating[]> => {
    try {
      console.log(`Fetching ratings for hostel ${hostelId}`);
      const response = await axios.get(
        `${API_BASE_URL}/display/hostel_rating`
      );
      
      console.log(`All ratings API response:`, response.data);
      
      // Filter ratings for this specific hostel
      if (response.data && Array.isArray(response.data.ratings)) {
        const hostelRatings = response.data.ratings.filter(
          (rating: any) => rating.p_hostelid === hostelId || rating.p_HostelId === hostelId || rating.hostel_id === hostelId
        );
        
        // Map to Rating interface
        return hostelRatings.map((rating: any) => ({
          p_RatingId: rating.p_RatingId || rating.id || 0,
          p_HostelId: rating.p_hostelid || rating.p_HostelId || rating.hostel_id,
          p_StudentId: rating.p_studentid || rating.p_StudentId || rating.student_id || 0,
          p_RatingStar: rating.p_ratingstar || rating.p_RatingStar || rating.rating || 0,
          p_MaintenanceRating: rating.p_maintenancerating || rating.p_MaintenanceRating || 0,
          p_IssueResolvingRate: rating.p_issueresolvingrate || rating.p_IssueResolvingRate || 0,
          p_ManagerBehaviour: rating.p_managerbehaviour || rating.p_ManagerBehaviour || 0,
          p_Challenges: rating.p_challenges || rating.p_Challenges || ""
        }));
      }
      
      console.log(`No ratings found for hostel ${hostelId}`);
      return [];
      
    } catch (error: any) {
      console.error(`Failed to fetch ratings:`, error.response?.data || error.message);
      return [];
    }
  };

  // Helper to get hostel expenses
  const getHostelExpenses = async (hostelId: number): Promise<Expense | null> => {
    try {
      console.log(`Fetching expenses for hostel ${hostelId}`);
      const response = await axios.post(
        `${API_BASE_URL}/Expenses/display/`,
        { p_HostelId: hostelId }
      );
      
      console.log(`Expenses response for hostel ${hostelId}:`, response.data);
      
      // Handle different response structures
      const data = response.data;
      
      if (data.expenses) {
        return data.expenses as Expense;
      }
      else if (data.result) {
        const result = data.result;
        return {
          p_isIncludedInRoomCharges: result.isIncludedInRoomCharges || false,
          p_RoomCharges: result.RoomCharges || [],
          p_SecurityCharges: result.SecurityCharges || 0,
          p_MessCharges: result.MessCharges || 0,
          p_KitchenCharges: result.KitchenCharges || 0,
          p_InternetCharges: result.InternetCharges || 0,
          p_AcServiceCharges: result.AcServiceCharges || 0,
          p_ElectricitybillType: result.ElectricitybillType || "According to Unit",
          p_ElectricityCharges: result.ElectricityCharges || 0
        };
      }
      else if (data.p_isIncludedInRoomCharges !== undefined) {
        return data as Expense;
      }
      
      console.log(`No expense data found for hostel ${hostelId}`);
      return null;
      
    } catch (error: any) {
      console.error(`Failed to fetch expenses for hostel ${hostelId}:`, 
        error.response?.data || error.message
      );
      return null;
    }
  };

  // Helper function to get room types from expenses
  const getRoomTypesFromExpenses = (expenses: Expense | null): RoomType[] => {
    if (!expenses || !expenses.p_RoomCharges || expenses.p_RoomCharges.length === 0) {
      return [];
    }
    
    return expenses.p_RoomCharges.map((rent, index) => {
      const types = ["1-Seater", "2-Seater", "3-Seater"];
      return {
        type: types[index] || `Room Type ${index + 1}`,
        rent: rent,
        available: Math.floor(Math.random() * 5) + 1 // Mock availability
      };
    });
  };
  
  // Fetch all hostel data from APIs
  const fetchHostelDetails = async () => {
    if (!hostelId) {
      console.error("No hostel ID provided");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      const id = parseInt(hostelId);
      
      // Fetch basic hostel info
      console.log("Fetching basic hostel info...");
      const basicInfoResponse = await axios.get(
        `${API_BASE_URL}/display/all_hostels`
      );
      
      // Find the specific hostel from all hostels
      let basicInfo = null;
      if (basicInfoResponse.data.hostels && Array.isArray(basicInfoResponse.data.hostels)) {
        basicInfo = basicInfoResponse.data.hostels.find(
          (h: any) => h.hostel_id === id || h.p_hostelid === id
        );
      }
      
      console.log("Basic hostel info found:", basicInfo);
      
      // Fetch other data in parallel
      const [images, ratings, expenses] = await Promise.all([
        getHostelImages(id),
        getHostelRatings(id),
        getHostelExpenses(id)
      ]);
      
      console.log("Fetched additional data:", { images, ratings, expenses });
      
      // Calculate average rating
      const averageRating = calculateAverageRating(ratings);
      
      // Get rooms from expenses or use default
      const roomsFromExpenses = getRoomTypesFromExpenses(expenses);
      const defaultRooms = [
        { type: "1-Seater", rent: 20000, available: 2 },
        { type: "2-Seater", rent: 15000, available: 5 },
        { type: "3-Seater", rent: 12000, available: 4 }
      ];
      
      const hostelDetails: HostelDetails = {
        hostel_id: id,
        p_name: basicInfo?.p_name || "Hostel",
        p_blockno: basicInfo?.p_blockno || "N/A",
        p_houseno: basicInfo?.p_houseno || "N/A",
        distance_from_university: basicInfo?.distance_from_university || 1.2,
        images: images,
        
        // Room types
        rooms: roomsFromExpenses.length > 0 ? roomsFromExpenses : defaultRooms,
        
        // Ratings
        ratings: ratings,
        averageRating: averageRating > 0 ? averageRating : undefined,
        
        // Expenses
        expenses: expenses,
        
        // Services - combine API services with expenses info
        services: [
          ...(basicInfo?.services || []),
          ...(expenses?.p_isIncludedInRoomCharges ? ["All utilities included"] : []),
          ...(expenses?.p_InternetCharges === 0 ? ["Free WiFi"] : []),
          ...(expenses?.p_KitchenCharges === 0 ? ["Free Kitchen Access"] : [])
        ].length > 0 ? [
          ...(basicInfo?.services || []),
          ...(expenses?.p_isIncludedInRoomCharges ? ["All utilities included"] : []),
          ...(expenses?.p_InternetCharges === 0 ? ["Free WiFi"] : []),
          ...(expenses?.p_KitchenCharges === 0 ? ["Free Kitchen Access"] : [])
        ] : [
          "24/7 Security with CCTV",
          "High-speed Internet",
          "Parking Available",
          "Laundry Support",
          "Backup Electricity",
          "Attached & Non-Attached Washrooms"
        ],
        
        // Mess details
        mess_charges: expenses?.p_MessCharges || basicInfo?.mess_charges || 7000,
        mess_description: basicInfo?.mess_description || "Breakfast, Lunch, Dinner included. Menu rotates weekly.",
        
        // Kitchen details
        kitchen_facilities: basicInfo?.kitchen_facilities || [
          "Shared Kitchen Available",
          "Fridge / Microwave",
          "Filtered Water",
          "Utensils Provided"
        ],
        
        // Additional expenses from API or expenses data
        electricity_charges: expenses?.p_ElectricitybillType || basicInfo?.electricity_charges || "According to Unit",
        security_deposit: expenses?.p_SecurityCharges || basicInfo?.security_deposit || 5000,
        maintenance_charges: expenses?.p_AcServiceCharges || basicInfo?.maintenance_charges || 500,
        wifi_included: expenses?.p_InternetCharges === 0 || true
      };
      
      console.log("Final hostel details:", hostelDetails);
      setHostel(hostelDetails);
      
    } catch (error) {
      console.error("Failed to fetch hostel details:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchHostelDetails();
  }, [hostelId]);
  
  // Handler functions
  const handleContactManager = () => {
    alert("Contacting manager...");
  };
  
  const handleWhatsApp = () => {
    alert("Opening WhatsApp...");
  };
  
  const handleGetDirections = () => {
    alert("Getting directions...");
  };
  
  const handleBack = () => {
    navigate(`/student/home?user_id=${userId}`);
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading hostel details...</p>
      </div>
    );
  }
  
  if (!hostel) {
    return (
      <div className={styles.errorContainer}>
        <h3>Hostel Not Found</h3>
        <button onClick={handleBack} className={styles.backBtn}>
          <i className="fa-solid fa-arrow-left"></i> Back to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.pageWrapper}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}><i className="fa-solid fa-building-user"></i> FastStay</div>
        <div className={styles.navLinks}>
          <a href={`/student/home?user_id=${userId}`} className={styles.navLink}>Home</a>
          <a href={`/student/profile?user_id=${userId}`} className={styles.navLink}>My Profile</a>
          <a href={`/student/suggestions?user_id=${userId}`} className={styles.navLink}>Suggestions</a>
          <a href="/logout" className={styles.navLink}>Logout</a>
        </div>
      </nav>
      
      {/* HEADER IMAGE - FIXED WITH PROPER IMAGE HANDLING */}
      <div className={styles.headerImage}>
        {hostel.images && hostel.images.length > 0 ? (
          <>
            <img 
              src={hostel.images[0]?.p_PhotoLink} 
              alt={hostel.p_name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.log('Image failed to load:', hostel.images[0]?.p_PhotoLink);
                target.src = `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop`;
              }}
              onLoad={() => console.log('Image loaded successfully:', hostel.images[0]?.p_PhotoLink)}
            />
            {hostel.images.length > 1 && (
              <div className={styles.imageCounter}>
                <i className="fa-solid fa-images"></i> {hostel.images.length} images
              </div>
            )}
          </>
        ) : (
          <div className={styles.noImagePlaceholder}>
            <img 
              src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop`}
              alt={hostel.p_name}
            />
          </div>
        )}
        <h1>{hostel.p_name}</h1>
        <p>
          <i className="fa-solid fa-location-dot"></i> 
          {hostel.distance_from_university?.toFixed(1)} km from FAST Lahore
          {hostel.averageRating && (
            <span style={{ marginLeft: '15px' }}>
              <i className="fa-solid fa-star" style={{ color: '#ffd700', marginRight: '5px' }}></i>
              {hostel.averageRating.toFixed(1)}/5.0
            </span>
          )}
        </p>
      </div>
      
      <div className={styles.container}>
        {/* ROOMS */}
        <section className={styles.box}>
          <h2><i className="fa-solid fa-bed"></i> Room Types</h2>
          <div className={styles.roomGrid}>
            {hostel.rooms.map((room, index) => (
              <div key={index} className={styles.roomCard}>
                <h3>{room.type}</h3>
                <p>Rent: {room.rent.toLocaleString()} PKR</p>
                <p>Availability: {room.available} rooms</p>
              </div>
            ))}
          </div>
          {hostel.expenses?.p_isIncludedInRoomCharges && (
            <p style={{ marginTop: '10px', color: '#27ae60', fontSize: '14px' }}>
              <i className="fa-solid fa-check-circle"></i> All utilities included in room charges
            </p>
          )}
        </section>
        
        {/* RATINGS SECTION */}
        {hostel.ratings.length > 0 && (
          <section className={styles.box}>
            <h2><i className="fa-solid fa-star"></i> Ratings & Reviews</h2>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8d5f3a', marginRight: '15px' }}>
                {hostel.averageRating?.toFixed(1)}
              </div>
              <div>
                <div style={{ color: '#ffd700', fontSize: '18px' }}>
                  {'★'.repeat(Math.floor(hostel.averageRating || 0))}
                  {'☆'.repeat(5 - Math.floor(hostel.averageRating || 0))}
                </div>
                <div style={{ fontSize: '14px', color: '#6c574b' }}>
                  Based on {hostel.ratings.length} review{hostel.ratings.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            {/* Rating Breakdown */}
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ color: '#5c3d2e', marginBottom: '10px' }}>Rating Breakdown</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6c574b' }}>Maintenance</div>
                  <div style={{ color: '#ffd700' }}>
                    {'★'.repeat(Math.floor(hostel.ratings.reduce((sum, r) => sum + r.p_MaintenanceRating, 0) / hostel.ratings.length))}
                    {'☆'.repeat(5 - Math.floor(hostel.ratings.reduce((sum, r) => sum + r.p_MaintenanceRating, 0) / hostel.ratings.length))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6c574b' }}>Manager Behavior</div>
                  <div style={{ color: '#ffd700' }}>
                    {'★'.repeat(Math.floor(hostel.ratings.reduce((sum, r) => sum + r.p_ManagerBehaviour, 0) / hostel.ratings.length))}
                    {'☆'.repeat(5 - Math.floor(hostel.ratings.reduce((sum, r) => sum + r.p_ManagerBehaviour, 0) / hostel.ratings.length))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Reviews */}
            {hostel.ratings.slice(0, 2).map((rating, index) => (
              <div key={index} style={{ 
                marginTop: '15px', 
                padding: '10px', 
                background: '#fff5e8', 
                borderRadius: '8px',
                borderLeft: '4px solid #8d5f3a'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ color: '#ffd700' }}>
                    {'★'.repeat(rating.p_RatingStar)}
                    {'☆'.repeat(5 - rating.p_RatingStar)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c574b' }}>Student #{rating.p_StudentId}</div>
                </div>
                {rating.p_Challenges && (
                  <div style={{ fontSize: '14px', color: '#5c3d2e' }}>"{rating.p_Challenges}"</div>
                )}
              </div>
            ))}
          </section>
        )}
        
        {/* DETAILED EXPENSES */}
        {hostel.expenses && (
          <section className={styles.box}>
            <h2><i className="fa-solid fa-money-bill-wave"></i> Detailed Expenses</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e0d6c9' }}>
                <span>Security Deposit</span>
                <span style={{ fontWeight: 'bold' }}>{hostel.expenses.p_SecurityCharges.toLocaleString()} PKR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e0d6c9' }}>
                <span>Mess Charges</span>
                <span style={{ fontWeight: 'bold' }}>{hostel.expenses.p_MessCharges.toLocaleString()} PKR/month</span>
              </div>
              {hostel.expenses.p_KitchenCharges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e0d6c9' }}>
                  <span>Kitchen Access</span>
                  <span style={{ fontWeight: 'bold' }}>{hostel.expenses.p_KitchenCharges.toLocaleString()} PKR/month</span>
                </div>
              )}
              {hostel.expenses.p_InternetCharges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e0d6c9' }}>
                  <span>Internet</span>
                  <span style={{ fontWeight: 'bold' }}>{hostel.expenses.p_InternetCharges.toLocaleString()} PKR/month</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span>Electricity</span>
                <span style={{ fontWeight: 'bold' }}>{hostel.expenses.p_ElectricitybillType}</span>
              </div>
            </div>
            
            {/* Total Estimate */}
            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #8d5f3a' }}>
              <h4 style={{ color: '#5c3d2e', marginBottom: '10px' }}>Estimated Monthly Total</h4>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8d5f3a' }}>
                {(() => {
                  const roomRent = hostel.rooms[0]?.rent || 0;
                  const mess = hostel.expenses.p_MessCharges || 0;
                  const kitchen = hostel.expenses.p_KitchenCharges || 0;
                  const internet = hostel.expenses.p_InternetCharges || 0;
                  return (roomRent + mess + kitchen + internet).toLocaleString();
                })()} PKR
                <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6c574b' }}>/month</span>
              </div>
              <div style={{ fontSize: '12px', color: '#6c574b', marginTop: '5px' }}>
                *Excluding electricity and security deposit
              </div>
            </div>
          </section>
        )}
        
        {/* SERVICES */}
        <section className={styles.box}>
          <h2><i className="fa-solid fa-list-check"></i> Services & Facilities</h2>
          <ul className={styles.list}>
            {hostel.services.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </section>
        
        {/* MESS DETAILS */}
        {hostel.mess_charges && hostel.mess_charges > 0 && (
          <section className={styles.box}>
            <h2><i className="fa-solid fa-utensils"></i> Mess Details</h2>
            <p>Monthly Mess Charges: <b>{hostel.mess_charges?.toLocaleString()} PKR</b></p>
            <p>Breakfast, Lunch, Dinner included</p>
            <p>Menu rotates weekly</p>
          </section>
        )}
        
        {/* KITCHEN DETAILS */}
        <section className={styles.box}>
          <h2><i className="fa-solid fa-kitchen-set"></i> Kitchen Details</h2>
          <ul className={styles.list}>
            {hostel.kitchen_facilities.map((facility, index) => (
              <li key={index}>{facility}</li>
            ))}
          </ul>
        </section>
        
        {/* ADDITIONAL EXPENSES */}
        <section className={styles.box}>
          <h2><i className="fa-solid fa-money-bill"></i> Additional Expenses</h2>
          <ul className={styles.list}>
            <li>Electricity: {hostel.electricity_charges}</li>
            <li>Security Deposit: {hostel.security_deposit?.toLocaleString()} PKR</li>
            <li>Maintenance Charges: {hostel.maintenance_charges?.toLocaleString()} PKR / month</li>
            <li>Wifi {hostel.wifi_included ? 'Included' : 'Extra Charges Apply'}</li>
          </ul>
        </section>
        
        {/* CONTACT BUTTONS */}
        <div className={styles.buttons}>
          <button className={styles.btn} onClick={handleContactManager}>
            <i className="fa-solid fa-phone"></i> Contact Manager
          </button>
          <button className={styles.btn} onClick={handleWhatsApp}>
            <i className="fa-brands fa-whatsapp"></i> WhatsApp
          </button>
          <button 
          className={styles.btn}
              onClick={() => navigate(`/student/rooms?hostel_id=${hostelId}&user_id=${userId}`)}>
            <i className="fa-solid fa-door-open"></i> View Rooms
        </button>
          <button className={styles.btn} onClick={handleGetDirections}>
            <i className="fa-solid fa-map-location-dot"></i> Get Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelDetails;