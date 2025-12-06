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
  images?: HostelImage[];
  
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
  const [activeImage, setActiveImage] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const hostelId = queryParams.get("id");
  const userId = queryParams.get("user_id") || "5";
  
  // Helper function to calculate average rating from ratings data
  const calculateAverageRating = (ratings: Rating[]): number => {
    if (!ratings || ratings.length === 0) return 4.0;
    
    const total = ratings.reduce((sum, rating) => sum + rating.p_RatingStar, 0);
    return parseFloat((total / ratings.length).toFixed(1));
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
  
  
  // Fetch all hostel data from multiple APIs
  const fetchHostelDetails = async () => {
    if (!hostelId) {
      console.error("No hostel ID provided");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      // Fetch basic hostel info
      const basicInfoPromise = axios.get(
        `http://127.0.0.1:8000/faststay_app/hostel_details/${hostelId}/`
      );
      
      // Fetch ratings
      const ratingsPromise = axios.post(
        `http://127.0.0.1:8000/faststay_app/display/hostel_rating/`,
        { p_HostelId: parseInt(hostelId) }
      );
      
      // Fetch expenses
      const expensesPromise = axios.post(
        `http://127.0.0.1:8000/faststay_app/Expenses/display/`,
        { p_HostelId: parseInt(hostelId) }
      );
      
      // Fetch images
      const imagesPromise = axios.post(
        `http://127.0.0.1:8000/faststay_app/display/hostel_pic/`,
        { p_HostelId: parseInt(hostelId) }
      );
      
      // Execute all promises in parallel
      const [basicInfoRes, ratingsRes, expensesRes, imagesRes] = await Promise.allSettled([
        basicInfoPromise,
        ratingsPromise,
        expensesPromise,
        imagesPromise
      ]);
      
      const apiData = basicInfoRes.status === 'fulfilled' ? basicInfoRes.value.data : {};
      const ratingsData = ratingsRes.status === 'fulfilled' ? ratingsRes.value.data : { ratings: [] };
      const expensesData = expensesRes.status === 'fulfilled' ? expensesRes.value.data : { expenses: null };
      const imagesData = imagesRes.status === 'fulfilled' ? imagesRes.value.data : { images: [] };
      
      // Calculate average rating
      const averageRating = calculateAverageRating(ratingsData.ratings || []);
      
      // Get rooms from expenses or use default
      const roomsFromExpenses = getRoomTypesFromExpenses(expensesData.expenses);
      const defaultRooms = [
        { type: "1-Seater", rent: 20000, available: 2 },
        { type: "2-Seater", rent: 15000, available: 5 },
        { type: "3-Seater", rent: 12000, available: 4 }
      ];
      
      setHostel({
        hostel_id: apiData.hostel_id || parseInt(hostelId),
        p_name: apiData.p_name || "Hostel",
        p_blockno: apiData.p_blockno || "N/A",
        p_houseno: apiData.p_houseno || "N/A",
        distance_from_university: apiData.distance_from_university || 1.2,
        images: imagesData.images || imagesData.photos || [],
        
        // Room types
        rooms: roomsFromExpenses.length > 0 ? roomsFromExpenses : defaultRooms,
        
        // Ratings
        ratings: ratingsData.ratings || [],
        averageRating: averageRating,
        
        // Expenses
        expenses: expensesData.expenses || null,
        
        // Services - combine API services with expenses info
        services: [
          ...(apiData.services || []),
          ...(expensesData.expenses?.p_isIncludedInRoomCharges ? ["All utilities included"] : []),
          ...(expensesData.expenses?.p_InternetCharges === 0 ? ["Free WiFi"] : []),
          ...(expensesData.expenses?.p_KitchenCharges === 0 ? ["Free Kitchen Access"] : [])
        ].length > 0 ? [
          ...(apiData.services || []),
          ...(expensesData.expenses?.p_isIncludedInRoomCharges ? ["All utilities included"] : []),
          ...(expensesData.expenses?.p_InternetCharges === 0 ? ["Free WiFi"] : []),
          ...(expensesData.expenses?.p_KitchenCharges === 0 ? ["Free Kitchen Access"] : [])
        ] : [
          "24/7 Security with CCTV",
          "High-speed Internet",
          "Parking Available",
          "Laundry Support",
          "Backup Electricity",
          "Attached & Non-Attached Washrooms"
        ],
        
        // Mess details
        mess_charges: expensesData.expenses?.p_MessCharges || apiData.mess_charges || 7000,
        mess_description: apiData.mess_description || "Breakfast, Lunch, Dinner included. Menu rotates weekly.",
        
        // Kitchen details
        kitchen_facilities: apiData.kitchen_facilities || [
          "Shared Kitchen Available",
          "Fridge / Microwave",
          "Filtered Water",
          "Utensils Provided"
        ],
        
        // Additional expenses from API or expenses data
        electricity_charges: expensesData.expenses?.p_ElectricitybillType || apiData.electricity_charges || "According to Unit",
        security_deposit: expensesData.expenses?.p_SecurityCharges || apiData.security_deposit || 5000,
        maintenance_charges: expensesData.expenses?.p_AcServiceCharges || apiData.maintenance_charges || 500,
        wifi_included: expensesData.expenses?.p_InternetCharges === 0 || true
      });
      
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
      
      {/* HEADER IMAGE */}
      <div className={styles.headerImage}>
        {hostel.images && hostel.images.length > 0 ? (
          <img 
            src={hostel.images[0]?.p_PhotoLink || ``} 
            alt={hostel.p_name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = ``;
            }}
          />
        ) : (
          <img 
            src={``} 
            alt={hostel.p_name}
          />
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
          <button className={styles.btn} onClick={handleGetDirections}>
            <i className="fa-solid fa-map-location-dot"></i> Get Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostelDetails;