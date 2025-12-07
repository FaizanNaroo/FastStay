import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../styles/ViewRooms.module.css";

interface Room {
  p_RoomNo: number;
  p_FloorNo: number;
  p_SeaterNo: number;
  p_BedType: string;
  p_WashroomType: string;
  p_CupboardType: string;
  p_RoomRent: number;
  p_isVentilated: boolean;
  p_isCarpet: boolean;
  p_isMiniFridge: boolean;
}

interface HostelInfo {
  p_name: string;
  p_blockno: string;
  p_houseno: string;
  distance_from_university?: number;
  averageRating?: number;
}

interface RoomPic {
  p_PhotoLink: string;
  p_RoomNo: number | null;
  p_RoomSeaterNo: number;
}

const ViewRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  
  // State for room pictures
  const [roomPics, setRoomPics] = useState<RoomPic[]>([]);
  const [roomPicIndices, setRoomPicIndices] = useState<{ [key: number]: number }>({});
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const hostelId = queryParams.get("hostel_id");
  const userId = queryParams.get("user_id") || "5";
  
  // API Base URL
  const API_BASE_URL = "http://127.0.0.1:8000/faststay_app";
  
  // Filter states
  const [filters, setFilters] = useState({
    seater: "all",
    floor: "all",
    bedType: "all",
    washroom: "all",
    minRent: "",
    maxRent: "",
    hasFridge: false,
    hasCarpet: false,
    hasVentilation: false
  });

  useEffect(() => {
    const initialIndices: { [key: number]: number } = {};
    rooms.forEach(room => {
      initialIndices[room.p_RoomNo] = 0;
    });
    setRoomPicIndices(initialIndices);
  }, [rooms]);

  // Helper function to get hostel information
  const getHostelInfo = async (): Promise<HostelInfo | null> => {
    if (!hostelId) return null;
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/display/all_hostels`
      );
      
      if (response.data.hostels && Array.isArray(response.data.hostels)) {
        const hostel = response.data.hostels.find(
          (h: any) => h.hostel_id === parseInt(hostelId) || h.p_hostelid === parseInt(hostelId)
        );
        
        if (hostel) {
          return {
            p_name: hostel.p_name || "Hostel",
            p_blockno: hostel.p_blockno || "N/A",
            p_houseno: hostel.p_houseno || "N/A",
            distance_from_university: hostel.distance_from_university,
            averageRating: hostel.rating || hostel.averageRating
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch hostel info:", error);
      return null;
    }
  };

  // Fetch room pictures for the hostel
  const fetchRoomPics = async (hostelId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/display/room_pic?p_HostelId=${hostelId}`
      );
      
      console.log("Room pics response:", response.data);
      
      if (response.status === 200) {
        let picsData: RoomPic[] = [];
        
        // Handle different response formats
        if (Array.isArray(response.data)) {
          picsData = response.data.map((pic: any) => ({
            p_PhotoLink: pic.p_PhotoLink || pic.photolink || pic.p_photolink,
            p_RoomNo: pic.p_RoomNo !== undefined ? pic.p_RoomNo : null,
            p_RoomSeaterNo: pic.p_RoomSeaterNo || pic.seaterno || 0
          }));
        } else if (response.data.p_PhotoLink) {
          // Single picture object
          picsData = [{
            p_PhotoLink: response.data.p_PhotoLink,
            p_RoomNo: response.data.p_RoomNo || null,
            p_RoomSeaterNo: response.data.p_RoomSeaterNo || 0
          }];
        }
        
        console.log(`Found ${picsData.length} room pictures for hostel ${hostelId}`);
        setRoomPics(picsData);
        
        
        
      } else {
        console.log("No pictures found or empty response");
        setRoomPics([]);
      }
    } catch (error: any) {
      // Don't treat 404/500 as errors - just means no pictures
      if (error.response?.status === 404 || error.response?.status === 500) {
        console.log("No room pictures found (expected)");
        setRoomPics([]);
      } else {
        console.error("Error fetching room pictures:", error);
        setRoomPics([]);
      }
    }
  };

  // Get pictures for a specific room - MATCHING THE AddRoom LOGIC
  const getRoomPics = (room: Room): string[] => {
    if (!roomPics.length) return [];
    
    const roomPicsList: string[] = [];
    
    // 1. Specific room pics (roomno matches exactly)
    const roomSpecific = roomPics
      .filter(pic => pic.p_RoomNo === (room.p_RoomNo / 100))
      .map(pic => pic.p_PhotoLink);
    
    roomPicsList.push(...roomSpecific);
    
    // 2. Shared seater pics (roomno is null, roomseaterno matches)
    const sharedSeater = roomPics
      .filter(pic =>
        pic.p_RoomNo === null &&
        pic.p_RoomSeaterNo === room.p_SeaterNo
      )
      .map(pic => pic.p_PhotoLink);
    
    roomPicsList.push(...sharedSeater);
    
    // Remove duplicates (in case same photo exists in both)
    return [...new Set(roomPicsList)];
  };

  const nextPic = (roomNo: number) => {
    const room = filteredRooms.find(r => r.p_RoomNo === roomNo);
    if (!room) return;

    const roomPicsList = getRoomPics(room);
    if (roomPicsList.length <= 1) return;

    setRoomPicIndices(prev => ({
      ...prev,
      [roomNo]: ((prev[roomNo] ?? 0) + 1) % roomPicsList.length
    }));
  };

  const prevPic = (roomNo: number) => {
    const room = filteredRooms.find(r => r.p_RoomNo === roomNo);
    if (!room) return;

    const roomPicsList = getRoomPics(room);
    if (roomPicsList.length <= 1) return;

    setRoomPicIndices(prev => ({
      ...prev,
      [roomNo]: ((prev[roomNo] ?? 0) - 1 + roomPicsList.length) % roomPicsList.length
    }));
  };

  // Fetch all rooms for the hostel using DisplayAllHostel API
  const fetchRooms = async () => {
    if (!hostelId) {
      console.error("No hostel ID provided");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      // First get hostel info
      const info = await getHostelInfo();
      setHostelInfo(info);
      
      // Fetch room pictures
      await fetchRoomPics(hostelId);
      
      // Fetch ALL rooms for this hostel using the correct API
      console.log("Fetching all rooms for hostel:", hostelId);
      const response = await axios.post(
        `${API_BASE_URL}/Rooms/DisplayAllHostel/`,
        { p_HostelId: parseInt(hostelId) }
      );
      
      console.log("Rooms API response:", response.data);
      
      if (response.data.success && response.data.result && Array.isArray(response.data.result)) {
        // Process rooms and add room numbers
        const fetchedRooms = response.data.result.map((room: any, index: number) => ({
          p_RoomNo: (parseInt( room.floorNo || 1) * 100) + index + 1,
          p_FloorNo: room.floorNo || 1,
          p_SeaterNo: room.seaterNo || 1,
          p_BedType: room.bedType || "Single",
          p_WashroomType: room.washroomType || "Attached",
          p_CupboardType: room.cupboardType || "PerPerson",
          p_RoomRent: room.roomRent || 0,
          p_isVentilated: room.isVentilated || false,
          p_isCarpet: room.isCarpet || false,
          p_isMiniFridge: room.isMiniFridge || false
        }));
        
        // Sort rooms by seater type and rent
        fetchedRooms.sort((a: Room, b: Room) => {
          if (a.p_SeaterNo !== b.p_SeaterNo) {
            return a.p_SeaterNo - b.p_SeaterNo;
          }
          return a.p_RoomRent - b.p_RoomRent;
        });
        
        console.log("Processed rooms:", fetchedRooms);
        setRooms(fetchedRooms);
        setFilteredRooms(fetchedRooms);
        
      } else {
        console.log("No rooms found or invalid response:", response.data);
        setRooms([]);
        setFilteredRooms([]);
      }
      
    } catch (error: any) {
      console.error("Failed to fetch rooms:", error.response?.data || error.message);
      
      // For development/testing, create mock data
      const mockRooms = createMockRooms();
      setRooms(mockRooms);
      setFilteredRooms(mockRooms);
      
    } finally {
      setLoading(false);
    }
  };

  // Mock data for testing when API fails
  const createMockRooms = (): Room[] => {
    const roomTypes = [
      { seater: 1, rent: 20000, floor: 1 },
      { seater: 2, rent: 15000, floor: 1 },
      { seater: 2, rent: 16000, floor: 2 },
      { seater: 3, rent: 12000, floor: 1 },
      { seater: 3, rent: 13000, floor: 2 },
      { seater: 4, rent: 10000, floor: 1 },
    ];
    
    return roomTypes.map((type, index) => ({
      p_RoomNo: index + 1,
      p_FloorNo: type.floor,
      p_SeaterNo: type.seater,
      p_BedType: type.seater === 1 ? "Single" : "Double",
      p_WashroomType: type.seater <= 2 ? "Attached" : "Shared",
      p_CupboardType: "Built-in",
      p_RoomRent: type.rent,
      p_isVentilated: Math.random() > 0.5,
      p_isCarpet: Math.random() > 0.7,
      p_isMiniFridge: Math.random() > 0.8
    }));
  };

  useEffect(() => {
    fetchRooms();
  }, [hostelId]);

  useEffect(() => {
    applyFilters();
  }, [rooms, filters]);

  const applyFilters = () => {
    let filtered = [...rooms];

    // Seater filter
    if (filters.seater !== "all") {
      filtered = filtered.filter(room => 
        room.p_SeaterNo.toString() === filters.seater
      );
    }

    // Floor filter
    if (filters.floor !== "all") {
      filtered = filtered.filter(room => 
        room.p_FloorNo.toString() === filters.floor
      );
    }

    // Bed type filter
    if (filters.bedType !== "all") {
      filtered = filtered.filter(room => 
        room.p_BedType.toLowerCase() === filters.bedType.toLowerCase()
      );
    }

    // Washroom filter
    if (filters.washroom !== "all") {
      filtered = filtered.filter(room => 
        room.p_WashroomType.toLowerCase().includes(filters.washroom.toLowerCase())
      );
    }

    // Min rent filter
    if (filters.minRent) {
      const min = parseInt(filters.minRent);
      filtered = filtered.filter(room => room.p_RoomRent >= min);
    }

    // Max rent filter
    if (filters.maxRent) {
      const max = parseInt(filters.maxRent);
      filtered = filtered.filter(room => room.p_RoomRent <= max);
    }

    // Feature filters
    if (filters.hasFridge) {
      filtered = filtered.filter(room => room.p_isMiniFridge);
    }
    
    if (filters.hasCarpet) {
      filtered = filtered.filter(room => room.p_isCarpet);
    }
    
    if (filters.hasVentilation) {
      filtered = filtered.filter(room => room.p_isVentilated);
    }

    setFilteredRooms(filtered);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      seater: "all",
      floor: "all",
      bedType: "all",
      washroom: "all",
      minRent: "",
      maxRent: "",
      hasFridge: false,
      hasCarpet: false,
      hasVentilation: false
    });
  };

  const handleViewRoomDetails = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomDetails(true);
  };

  const handleBookRoom = (room: Room) => {
    // Navigate to booking page or show booking modal
    alert(`Booking room ${room.p_RoomNo}...`);
    // In a real app: navigate(`/booking?hostel_id=${hostelId}&room_no=${room.p_RoomNo}&user_id=${userId}`);
  };

  const handleBack = () => {
    navigate(`/student/hostelDetails?id=${hostelId}&user_id=${userId}`);
  };

  const handleBackToHome = () => {
    navigate(`/student/home?user_id=${userId}`);
  };

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return `PKR ${amount.toLocaleString()}`;
  };

  // Get first image for a room (for modal display)
  const getRoomImage = (room: Room): string => {
    const roomPicsList = getRoomPics(room);
    return roomPicsList.length > 0 ? roomPicsList[0] : `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80`;
  };

  // Render loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading rooms...</p>
      </div>
    );
  }

  // Render no rooms state
  if (rooms.length === 0 && !loading) {
    return (
      <div className={styles.pageWrapper}>
        {/* NAVBAR */}
        <nav className={styles.navbar}>
          <div className={styles.logo}><i className="fa-solid fa-building-user"></i> FastStay</div>
          <div className={styles.navLinks}>
            <a href={`/student/home?user_id=${userId}`} className={styles.navLink}>Home</a>
            <a href={`/student/profile?user_id=${userId}`} className={styles.navLink}>My Profile</a>
            <a href={`/student/suggestions?user_id=${userId}`} className={styles.navLink}>Suggestions</a>
            <a href="/" className={styles.navLink}>Logout</a>
          </div>
        </nav>

        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <i className="fa-solid fa-door-closed"></i>
          </div>
          <h3>No Rooms Available</h3>
          <p>No rooms found for this hostel. Please try another hostel.</p>
          <div className={styles.errorButtons}>
            <button onClick={handleBack} className={styles.backBtn}>
              <i className="fa-solid fa-arrow-left"></i> Back to Hostel
            </button>
            <button onClick={handleBackToHome} className={styles.homeBtn}>
              <i className="fa-solid fa-house"></i> Back to Home
            </button>
          </div>
        </div>
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
          <a href="/" className={styles.navLink}>Logout</a>
        </div>
      </nav>

      {/* HOSTEL HEADER */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={handleBack} className={styles.backButton}>
            <i className="fa-solid fa-arrow-left"></i> Back to Hostel
          </button>
          <h1>Available Rooms</h1>
          <div className={styles.hostelInfo}>
            <h2>{hostelInfo?.p_name}</h2>
            <p className={styles.address}>
              <i className="fa-solid fa-location-dot"></i>
              Block {hostelInfo?.p_blockno}, House {hostelInfo?.p_houseno}
              {hostelInfo?.distance_from_university && (
                <span className={styles.distance}>
                  • {hostelInfo.distance_from_university.toFixed(1)} km from university
                </span>
              )}
            </p>
            {hostelInfo?.averageRating && (
              <div className={styles.rating}>
                <i className="fa-solid fa-star"></i>
                {hostelInfo.averageRating.toFixed(1)}/5.0
              </div>
            )}
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <i className="fa-solid fa-door-open"></i>
              <span>{rooms.length} Total Rooms</span>
            </div>
            <div className={styles.stat}>
              <i className="fa-solid fa-users"></i>
              <span>{rooms.reduce((acc, room) => acc + room.p_SeaterNo, 0)} Total Capacity</span>
            </div>
            <div className={styles.stat}>
              <i className="fa-solid fa-money-bill-wave"></i>
              <span>
                {rooms.length > 0 
                  ? `${formatCurrency(Math.min(...rooms.map(r => r.p_RoomRent)))} - ${formatCurrency(Math.max(...rooms.map(r => r.p_RoomRent)))}`
                  : 'No rates'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.container}>
        {/* FILTERS SECTION */}
        <div className={styles.filtersSection}>
          <h3><i className="fa-solid fa-filter"></i> Filter Rooms</h3>
          
          <div className={styles.filterGrid}>
            {/* Seater Type */}
            <div className={styles.filterGroup}>
              <label>Seater Type</label>
              <select
                value={filters.seater}
                onChange={(e) => handleFilterChange("seater", e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="1">1-Seater</option>
                <option value="2">2-Seater</option>
                <option value="3">3-Seater</option>
                <option value="4">4-Seater</option>
              </select>
            </div>

            {/* Floor */}
            <div className={styles.filterGroup}>
              <label>Floor</label>
              <select
                value={filters.floor}
                onChange={(e) => handleFilterChange("floor", e.target.value)}
              >
                <option value="all">All Floors</option>
                <option value="1">Ground Floor</option>
                <option value="2">1st Floor</option>
                <option value="3">2nd Floor</option>
                <option value="4">3rd Floor</option>
              </select>
            </div>

            {/* Bed Type */}
            <div className={styles.filterGroup}>
              <label>Bed Type</label>
              <select
                value={filters.bedType}
                onChange={(e) => handleFilterChange("bedType", e.target.value)}
              >
                <option value="all">All Bed Types</option>
                <option value="Bed">Single Bed</option>
                <option value="Matress">Matress</option>
              </select>
            </div>

            {/* Washroom */}
            <div className={styles.filterGroup}>
              <label>Washroom</label>
              <select
                value={filters.washroom}
                onChange={(e) => handleFilterChange("washroom", e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Attached">Attached</option>
                <option value="Shared">Shared</option>
              </select>
            </div>

            {/* Rent Range */}
            <div className={styles.filterGroup}>
              <label>Min Rent (PKR)</label>
              <input
                type="number"
                placeholder="e.g., 10000"
                value={filters.minRent}
                onChange={(e) => handleFilterChange("minRent", e.target.value)}
                min="0"
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Max Rent (PKR)</label>
              <input
                type="number"
                placeholder="e.g., 25000"
                value={filters.maxRent}
                onChange={(e) => handleFilterChange("maxRent", e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Feature Filters */}
          <div className={styles.featureFilters}>
            <h4>Features</h4>
            <div className={styles.featureGrid}>
              <label className={styles.featureCheckbox}>
                <input
                  type="checkbox"
                  checked={filters.hasVentilation}
                  onChange={(e) => handleFilterChange("hasVentilation", e.target.checked)}
                />
                <span><i className="fa-solid fa-wind"></i> Ventilated</span>
              </label>
              
              <label className={styles.featureCheckbox}>
                <input
                  type="checkbox"
                  checked={filters.hasCarpet}
                  onChange={(e) => handleFilterChange("hasCarpet", e.target.checked)}
                />
                <span><i className="fa-solid fa-carpet"></i> Carpet Floor</span>
              </label>
              
              <label className={styles.featureCheckbox}>
                <input
                  type="checkbox"
                  checked={filters.hasFridge}
                  onChange={(e) => handleFilterChange("hasFridge", e.target.checked)}
                />
                <span><i className="fa-solid fa-snowflake"></i> Mini Fridge</span>
              </label>
            </div>
          </div>

          {/* Filter Actions */}
          <div className={styles.filterActions}>
            <button onClick={clearFilters} className={styles.clearBtn}>
              <i className="fa-solid fa-times"></i> Clear All Filters
            </button>
            <div className={styles.resultsInfo}>
              <i className="fa-solid fa-list"></i>
              Showing {filteredRooms.length} of {rooms.length} rooms
            </div>
          </div>
        </div>

        {/* ROOMS GRID */}
        <div className={styles.roomsGrid}>
          {filteredRooms.length === 0 ? (
            <div className={styles.noResults}>
              <i className="fa-solid fa-search"></i>
              <h3>No rooms found</h3>
              <p>Try adjusting your filters</p>
              <button onClick={clearFilters} className={styles.resetBtn}>
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredRooms.map((room) => {
              const roomPicsList = getRoomPics(room);
              const currentIndex = roomPicIndices[room.p_RoomNo] || 0;
              const currentImage = roomPicsList.length > 0 
                ? roomPicsList[currentIndex]
                : `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop&q=80`;
              
              return (
                <div key={room.p_RoomNo} className={styles.roomCard}>
                  <div className={styles.cardImage}>
                    <img 
                      src={currentImage}
                      alt={`Room ${room.p_RoomNo}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop&q=80`;
                      }}
                    />
                    
                    {/* Picture navigation buttons (only show if multiple pictures) */}
                    {roomPicsList.length > 1 && (
                      <>
                        <button
                          className={`${styles.sliderBtn} ${styles.prevBtn}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            prevPic(room.p_RoomNo);
                          }}
                        >
                          <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <button
                          className={`${styles.sliderBtn} ${styles.nextBtn}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            nextPic(room.p_RoomNo);
                          }}
                        >
                          <i className="fa-solid fa-chevron-right"></i>
                        </button>
                        <div className={styles.sliderDots}>
                          {roomPicsList.map((_, idx) => (
                            <span
                              key={idx}
                              className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setRoomPicIndices(prev => ({
                                  ...prev,
                                  [room.p_RoomNo]: idx
                                }));
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    
                    <div className={styles.cardBadges}>
                      <span className={`${styles.seaterBadge} ${
                        room.p_SeaterNo === 1 ? styles.seater1 :
                        room.p_SeaterNo === 2 ? styles.seater2 :
                        room.p_SeaterNo === 3 ? styles.seater3 :
                        styles.seater4
                      }`}>
                        {room.p_SeaterNo}-Seater
                      </span>
                      <span className={styles.floorBadge}>
                        Floor {room.p_FloorNo}
                      </span>
                      {room.p_isMiniFridge && (
                        <span className={styles.fridgeBadge}>
                          <i className="fa-solid fa-snowflake"></i> Fridge
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <h3>Room #{room.p_RoomNo}</h3>
                      <div className={styles.roomPrice}>
                        {formatCurrency(room.p_RoomRent)}
                        <span>/month</span>
                      </div>
                    </div>
                    
                    <div className={styles.roomDetails}>
                      <div className={styles.detailItem}>
                        <i className="fa-solid fa-bed"></i>
                        <span>{room.p_BedType} Bed</span>
                      </div>
                      <div className={styles.detailItem}>
                        <i className="fa-solid fa-toilet"></i>
                        <span>{room.p_WashroomType} Washroom</span>
                      </div>
                      <div className={styles.detailItem}>
                        <i className="fa-solid fa-cabinet-filing"></i>
                        <span>{room.p_CupboardType} Cupboard</span>
                      </div>
                    </div>
                    
                    <div className={styles.roomFeatures}>
                      {room.p_isVentilated && (
                        <span className={styles.feature}>
                          <i className="fa-solid fa-wind"></i> Ventilated
                        </span>
                      )}
                      {room.p_isCarpet && (
                        <span className={styles.feature}>
                          <i className="fa-solid fa-carpet"></i> Carpet
                        </span>
                      )}
                      {room.p_isMiniFridge && (
                        <span className={styles.feature}>
                          <i className="fa-solid fa-snowflake"></i> Mini Fridge
                        </span>
                      )}
                    </div>
                    
                    <div className={styles.cardButtons}>
                      <button
                        className={styles.detailsBtn}
                        onClick={() => handleViewRoomDetails(room)}
                      >
                        <i className="fa-solid fa-eye"></i> View Details
                      </button>
                      <button
                        className={styles.bookBtn}
                        onClick={() => handleBookRoom(room)}
                      >
                        <i className="fa-solid fa-calendar-check"></i> Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ROOM DETAILS MODAL */}
      {showRoomDetails && selectedRoom && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Room #{selectedRoom.p_RoomNo} Details</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowRoomDetails(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.modalImage}>
                <img 
                  src={getRoomImage(selectedRoom)}
                  alt={`Room ${selectedRoom.p_RoomNo}`}
                />
                {/* Picture count indicator */}
                {getRoomPics(selectedRoom).length > 1 && (
                  <div className={styles.picCountIndicator}>
                    <i className="fa-solid fa-images"></i>
                    {getRoomPics(selectedRoom).length} photos available
                  </div>
                )}
              </div>
              
              <div className={styles.detailGrid}>
                <div className={styles.detailSection}>
                  <h3>Room Information</h3>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Room Number:</span>
                    <span className={styles.detailValue}>{selectedRoom.p_RoomNo}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Floor:</span>
                    <span className={styles.detailValue}>{selectedRoom.p_FloorNo}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Seater Type:</span>
                    <span className={styles.detailValue}>{selectedRoom.p_SeaterNo}-Seater</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Monthly Rent:</span>
                    <span className={styles.detailValueHighlight}>
                      {formatCurrency(selectedRoom.p_RoomRent)}
                    </span>
                  </div>
                </div>
                
                <div className={styles.detailSection}>
                  <h3>Furniture & Amenities</h3>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Bed Type:</span>
                    <span className={styles.detailValue}>{selectedRoom.p_BedType}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Washroom:</span>
                    <span className={styles.detailValue}>{selectedRoom.p_WashroomType}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Cupboard:</span>
                    <span className={styles.detailValue}>{selectedRoom.p_CupboardType}</span>
                  </div>
                </div>
                
                <div className={styles.detailSection}>
                  <h3>Additional Features</h3>
                  <div className={styles.featureList}>
                    {selectedRoom.p_isVentilated && (
                      <div className={styles.featureItem}>
                        <i className="fa-solid fa-check-circle"></i>
                        <span>Well Ventilated</span>
                      </div>
                    )}
                    {selectedRoom.p_isCarpet && (
                      <div className={styles.featureItem}>
                        <i className="fa-solid fa-check-circle"></i>
                        <span>Carpeted Floor</span>
                      </div>
                    )}
                    {selectedRoom.p_isMiniFridge && (
                      <div className={styles.featureItem}>
                        <i className="fa-solid fa-check-circle"></i>
                        <span>Mini Fridge Included</span>
                      </div>
                    )}
                    {!selectedRoom.p_isVentilated && !selectedRoom.p_isCarpet && !selectedRoom.p_isMiniFridge && (
                      <div className={styles.noFeatures}>
                        No additional features
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  className={styles.modalBookBtn}
                  onClick={() => handleBookRoom(selectedRoom)}
                >
                  <i className="fa-solid fa-calendar-check"></i> Book This Room
                </button>
                <button 
                  className={styles.modalCloseBtn}
                  onClick={() => setShowRoomDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRooms;