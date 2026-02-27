import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  rooms: RoomType[];
  ratings: Rating[];
  averageRating?: number;
  expenses: Expense | null;
  services: string[];
  mess_charges?: number;
  mess_description?: string;
  kitchen_facilities: string[];
  electricity_charges?: string;
  security_deposit?: number;
  maintenance_charges?: number;
  wifi_included: boolean;
}

const API_BASE_URL = "http://127.0.0.1:8000/faststay_app";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCached = <T,>(key: string): T | null => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data as T;
  } catch {
    return null;
  }
};

const setCache = (key: string, data: any) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* storage full, ignore */ }
};

const calculateAverageRating = (ratings: Rating[]): number => {
  if (!ratings || ratings.length === 0) return 0;
  const total = ratings.reduce((sum, rating) => sum + rating.p_RatingStar, 0);
  return parseFloat((total / ratings.length).toFixed(1));
};

const getHostelImages = async (hostelId: number, signal: AbortSignal): Promise<HostelImage[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/display/hostel_pic?p_HostelId=${hostelId}`,
      { signal }
    );
    const imageData = response.data;

    if (imageData && imageData.p_photolink) {
      return [{ p_PhotoLink: imageData.p_photolink }];
    } else if (imageData && imageData.p_PhotoLink) {
      return [{ p_PhotoLink: imageData.p_PhotoLink }];
    } else if (Array.isArray(imageData)) {
      return imageData
        .filter((img: any) => img.p_photolink || img.p_PhotoLink)
        .map((img: any) => ({
          p_PhotoLink: img.p_photolink || img.p_PhotoLink
        }));
    }
    return [];
  } catch (error: any) {
    if (axios.isCancel(error)) throw error;
    return [];
  }
};

const getHostelRatings = async (hostelId: number, signal: AbortSignal): Promise<Rating[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/display/hostel_rating`,
      { signal }
    );
    if (response.data && Array.isArray(response.data.ratings)) {
      return response.data.ratings
        .filter((rating: any) =>
          rating.p_hostelid === hostelId || rating.p_HostelId === hostelId || rating.hostel_id === hostelId
        )
        .map((rating: any) => ({
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
    return [];
  } catch (error: any) {
    if (axios.isCancel(error)) throw error;
    return [];
  }
};

const getHostelExpenses = async (hostelId: number, signal: AbortSignal): Promise<Expense | null> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/Expenses/display/`,
      { p_HostelId: hostelId },
      { signal }
    );
    const data = response.data;

    if (data.expenses) {
      return data.expenses as Expense;
    } else if (data.result) {
      const result = data.result;
      return {
        p_isIncludedInRoomCharges: result.isIncludedInRoomCharges || false,
        p_RoomCharges: result.RoomCharges || [],
        p_SecurityCharges: result.SecurityCharges || 0,
        p_MessCharges: result.MessCharges || 0,
        p_KitchenCharges: result.KitchenCharges || 0,
        p_InternetCharges: result.InternetCharges || 0,
        p_AcServiceCharges: result.AcServiceCharges || 0,
        p_ElectricitybillType: result.ElectricitybillType || "",
        p_ElectricityCharges: result.ElectricityCharges || 0
      };
    } else if (data.p_isIncludedInRoomCharges !== undefined) {
      return data as Expense;
    }
    return null;
  } catch (error: any) {
    if (axios.isCancel(error)) throw error;
    return null;
  }
};

const getRoomTypesFromExpenses = (expenses: Expense | null): RoomType[] => {
  if (!expenses || !expenses.p_RoomCharges || expenses.p_RoomCharges.length === 0) {
    return [];
  }
  const types = ["1-Seater", "2-Seater", "3-Seater"];
  return expenses.p_RoomCharges.map((rent, index) => ({
    type: types[index] || `Room Type ${index + 1}`,
    rent,
    available: 0 // actual availability should come from the API
  }));
};

const SkeletonLoader: React.FC = () => (
  <>
    <div className={styles.skeletonHeader} />
    <div className={styles.container}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={styles.skeletonBox}>
          <div className={styles.skeletonLine} style={{ width: '40%', height: '24px' }} />
          <div className={styles.skeletonLine} style={{ width: '100%' }} />
          <div className={styles.skeletonLine} style={{ width: '80%' }} />
          <div className={styles.skeletonLine} style={{ width: '60%' }} />
        </div>
      ))}
    </div>
  </>
);

const Navbar: React.FC<{ userId: string }> = ({ userId }) => (
  <nav className={styles.navbar}>
    <div className={styles.logo}><i className="fa-solid fa-building-user"></i> FastStay</div>
    <div className={styles.navLinks}>
      <a href={`/student/home?user_id=${userId}`} className={styles.navLink}>Home</a>
      <a href={`/student/profile?user_id=${userId}`} className={styles.navLink}>My Profile</a>
      <a href={`/student/suggestions?user_id=${userId}`} className={styles.navLink}>Suggestions</a>
      <a href="/" className={styles.navLink}>Logout</a>
    </div>
  </nav>
);

const HostelDetails: React.FC = () => {
  const [hostel, setHostel] = useState<HostelDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const hostelId = queryParams.get("id");
  const userId = queryParams.get("user_id") || "";

  const fetchHostelDetails = useCallback(async (signal: AbortSignal) => {
    if (!hostelId) {
      setLoading(false);
      return;
    }

    const cacheKey = `hostel_details_${hostelId}`;
    const cached = getCached<HostelDetails>(cacheKey);
    if (cached) {
      setHostel(cached);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const id = parseInt(hostelId);

      const basicInfoResponse = await axios.get(
        `${API_BASE_URL}/display/all_hostels`,
        { signal }
      );

      let basicInfo = null;
      if (basicInfoResponse.data.hostels && Array.isArray(basicInfoResponse.data.hostels)) {
        basicInfo = basicInfoResponse.data.hostels.find(
          (h: any) => h.hostel_id === id || h.p_hostelid === id
        );
      }

      const [images, ratings, expenses] = await Promise.all([
        getHostelImages(id, signal),
        getHostelRatings(id, signal),
        getHostelExpenses(id, signal)
      ]);

      const averageRating = calculateAverageRating(ratings);
      const roomsFromExpenses = getRoomTypesFromExpenses(expenses);

      const derivedServices: string[] = [];
      if (expenses?.p_isIncludedInRoomCharges) derivedServices.push("All utilities included");
      if (expenses?.p_InternetCharges === 0) derivedServices.push("Free WiFi");
      if (expenses?.p_KitchenCharges === 0) derivedServices.push("Free Kitchen Access");
      const apiServices: string[] = basicInfo?.services || [];

      const hostelDetails: HostelDetails = {
        hostel_id: id,
        p_name: basicInfo?.p_name || "",
        p_blockno: basicInfo?.p_blockno || "",
        p_houseno: basicInfo?.p_houseno || "",
        distance_from_university: basicInfo?.distance_from_university,
        images,
        rooms: roomsFromExpenses,
        ratings,
        averageRating: averageRating > 0 ? averageRating : undefined,
        expenses,
        services: [...apiServices, ...derivedServices],
        mess_charges: expenses?.p_MessCharges,
        mess_description: basicInfo?.mess_description || "",
        kitchen_facilities: basicInfo?.kitchen_facilities || [],
        electricity_charges: expenses?.p_ElectricitybillType || "",
        security_deposit: expenses?.p_SecurityCharges,
        maintenance_charges: expenses?.p_AcServiceCharges,
        wifi_included: expenses?.p_InternetCharges === 0
      };

      setHostel(hostelDetails);
      setCache(cacheKey, hostelDetails);
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      console.error("Failed to fetch hostel details:", error);
    } finally {
      setLoading(false);
    }
  }, [hostelId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchHostelDetails(controller.signal);
    return () => controller.abort();
  }, [fetchHostelDetails]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [hostelId]);

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

  const ratingBreakdown = useMemo(() => {
    if (!hostel || hostel.ratings.length === 0) return null;
    const count = hostel.ratings.length;
    return {
      maintenance: Math.floor(hostel.ratings.reduce((s, r) => s + r.p_MaintenanceRating, 0) / count),
      manager: Math.floor(hostel.ratings.reduce((s, r) => s + r.p_ManagerBehaviour, 0) / count),
    };
  }, [hostel]);

  const estimatedMonthly = useMemo(() => {
    if (!hostel || !hostel.expenses) return null;
    const roomRent = hostel.rooms[0]?.rent || 0;
    const mess = hostel.expenses.p_MessCharges || 0;
    const kitchen = hostel.expenses.p_KitchenCharges || 0;
    const internet = hostel.expenses.p_InternetCharges || 0;
    return roomRent + mess + kitchen + internet;
  }, [hostel]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar userId={userId} />
        <SkeletonLoader />
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar userId={userId} />
        <div className={styles.errorContainer}>
          <h3>Hostel Not Found</h3>
          <button onClick={handleBack} className={styles.backBtn}>
            <i className="fa-solid fa-arrow-left"></i> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Navbar userId={userId} />

      <div className={styles.headerImage}>
        {hostel.images.length > 0 ? (
          <>
            <img
              src={hostel.images[0].p_PhotoLink}
              alt={hostel.p_name}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {hostel.images.length > 1 && (
              <div className={styles.imageCounter}>
                <i className="fa-solid fa-images"></i> {hostel.images.length} images
              </div>
            )}
          </>
        ) : (
          <div className={styles.noImagePlaceholder}>
            <i className="fa-solid fa-image" style={{ fontSize: '48px', color: '#ccc' }}></i>
            <p>No image available</p>
          </div>
        )}
        <h1>{hostel.p_name || "Unknown Hostel"}</h1>
        <p>
          {hostel.distance_from_university != null && (
            <>
              <i className="fa-solid fa-location-dot"></i>{" "}
              {hostel.distance_from_university.toFixed(1)} km from FAST Lahore
            </>
          )}
          {hostel.averageRating && (
            <span style={{ marginLeft: '15px' }}>
              <i className="fa-solid fa-star" style={{ color: '#ffd700', marginRight: '5px' }}></i>
              {hostel.averageRating.toFixed(1)}/5.0
            </span>
          )}
        </p>
      </div>

      <div className={styles.container}>
        {hostel.rooms.length > 0 && (
          <section className={styles.box}>
            <h2><i className="fa-solid fa-bed"></i> Room Types</h2>
            <div className={styles.roomGrid}>
              {hostel.rooms.map((room, index) => (
                <div key={index} className={styles.roomCard}>
                  <h3>{room.type}</h3>
                  <p>Rent: {room.rent.toLocaleString()} PKR</p>
                </div>
              ))}
            </div>
            {hostel.expenses?.p_isIncludedInRoomCharges && (
              <p style={{ marginTop: '10px', color: '#27ae60', fontSize: '14px' }}>
                <i className="fa-solid fa-check-circle"></i> All utilities included in room charges
              </p>
            )}
          </section>
        )}

        {hostel.ratings.length > 0 && ratingBreakdown && (
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

            <div style={{ marginTop: '15px' }}>
              <h4 style={{ color: '#5c3d2e', marginBottom: '10px' }}>Rating Breakdown</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6c574b' }}>Maintenance</div>
                  <div style={{ color: '#ffd700' }}>
                    {'★'.repeat(ratingBreakdown.maintenance)}
                    {'☆'.repeat(5 - ratingBreakdown.maintenance)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6c574b' }}>Manager Behavior</div>
                  <div style={{ color: '#ffd700' }}>
                    {'★'.repeat(ratingBreakdown.manager)}
                    {'☆'.repeat(5 - ratingBreakdown.manager)}
                  </div>
                </div>
              </div>
            </div>

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

        {hostel.expenses && (
          <section className={styles.box}>
            <h2><i className="fa-solid fa-money-bill-wave"></i> Detailed Expenses</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {hostel.expenses.p_SecurityCharges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e0d6c9' }}>
                  <span>Security Deposit</span>
                  <span style={{ fontWeight: 'bold' }}>{hostel.expenses.p_SecurityCharges.toLocaleString()} PKR</span>
                </div>
              )}
              {hostel.expenses.p_MessCharges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e0d6c9' }}>
                  <span>Mess Charges</span>
                  <span style={{ fontWeight: 'bold' }}>{hostel.expenses.p_MessCharges.toLocaleString()} PKR/month</span>
                </div>
              )}
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
              {hostel.expenses.p_ElectricitybillType && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span>Electricity</span>
                  <span style={{ fontWeight: 'bold' }}>{hostel.expenses.p_ElectricitybillType}</span>
                </div>
              )}
            </div>

            {estimatedMonthly != null && estimatedMonthly > 0 && (
              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #8d5f3a' }}>
                <h4 style={{ color: '#5c3d2e', marginBottom: '10px' }}>Estimated Monthly Total</h4>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8d5f3a' }}>
                  {estimatedMonthly.toLocaleString()} PKR
                  <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6c574b' }}>/month</span>
                </div>
                <div style={{ fontSize: '12px', color: '#6c574b', marginTop: '5px' }}>
                  *Excluding electricity and security deposit
                </div>
              </div>
            )}
          </section>
        )}

        {hostel.services.length > 0 && (
          <section className={styles.box}>
            <h2><i className="fa-solid fa-list-check"></i> Services & Facilities</h2>
            <ul className={styles.list}>
              {hostel.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </section>
        )}

        {hostel.mess_charges != null && hostel.mess_charges > 0 && (
          <section className={styles.box}>
            <h2><i className="fa-solid fa-utensils"></i> Mess Details</h2>
            <p>Monthly Mess Charges: <b>{hostel.mess_charges.toLocaleString()} PKR</b></p>
            {hostel.mess_description && <p>{hostel.mess_description}</p>}
          </section>
        )}

        {hostel.kitchen_facilities.length > 0 && (
          <section className={styles.box}>
            <h2><i className="fa-solid fa-kitchen-set"></i> Kitchen Details</h2>
            <ul className={styles.list}>
              {hostel.kitchen_facilities.map((facility, index) => (
                <li key={index}>{facility}</li>
              ))}
            </ul>
          </section>
        )}

        {(hostel.electricity_charges || hostel.security_deposit || hostel.maintenance_charges) && (
          <section className={styles.box}>
            <h2><i className="fa-solid fa-money-bill"></i> Additional Expenses</h2>
            <ul className={styles.list}>
              {hostel.electricity_charges && <li>Electricity: {hostel.electricity_charges}</li>}
              {hostel.security_deposit != null && hostel.security_deposit > 0 && (
                <li>Security Deposit: {hostel.security_deposit.toLocaleString()} PKR</li>
              )}
              {hostel.maintenance_charges != null && hostel.maintenance_charges > 0 && (
                <li>AC Service Charges: {hostel.maintenance_charges.toLocaleString()} PKR</li>
              )}
              <li>WiFi: {hostel.wifi_included ? 'Included' : 'Extra Charges Apply'}</li>
            </ul>
          </section>
        )}

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