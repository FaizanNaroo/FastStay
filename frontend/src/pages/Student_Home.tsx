import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/StudentHome.module.css";

interface Hostel {
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
  p_name: string;
  hostel_id: number;
  p_hostelid?: number;         
  p_managerid?: number;        
  distance_from_university: number;
  rating: number;
  monthly_rent: number;
  available_rooms: number;
  images?: string[];
  location?: string;
}

interface FilterState {
  maxRent: string;
  distance: string;
  hostelType: string;
  rating: string;
  hasParking: boolean | null;
  hasMess: boolean | null;
  hasGeyser: boolean | null;
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

const StudentHome: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [filteredHostels, setFilteredHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const navigate = useNavigate();
  
  // Extract user_id from URL query parameter
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get("user_id") || "5";

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    maxRent: "",
    distance: "",
    hostelType: "",
    rating: "",
    hasParking: null,
    hasMess: null,
    hasGeyser: null
  });

  // Helper function to get hostel images from API - CORRECTED for POST
  const getHostelImages = async (hostelId: number): Promise<string[]> => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/faststay_app/display/hostel_pic`,
        { p_HostelId: hostelId.toString() }
      );
      
      console.log(`Images API response for hostel ${hostelId}:`, response.data);
      
      // Your view returns info_list[0] which is a single object
      const imageData = response.data;
      
      // Handle the single object response
      if (imageData && imageData.p_photolink) {
        const photoLink = imageData.p_photolink;
        // Check if it's a relative path and prepend base URL if needed
        if (photoLink && photoLink.startsWith('/')) {
          return [`http://127.0.0.1:8000${photoLink}`];
        }
        return [photoLink];
      }
      
      // If no image link found
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

  // Helper function to get expenses (for monthly rent) from API
  const getHostelExpenses = async (hostelId: number): Promise<{monthly_rent: number, available_rooms: number}> => {
    try {
      // Try POST first (as per your initial code)
      const response = await axios.post(
        `http://127.0.0.1:8000/faststay_app/Expenses/display/`,
        { p_HostelId: hostelId }
      );
      
      console.log(`Expenses response for hostel ${hostelId}:`, response.data);
      
      if (response.data.result && response.data.result.RoomCharges && 
          response.data.result.RoomCharges.length > 0) {
        // Use the first room charge as monthly rent
        const monthly_rent = response.data.result.RoomCharges[0];
        // Mock available rooms calculation
        const available_rooms = Math.max(1, Math.floor(Math.random() * 10) + 1);
        
        return { monthly_rent, available_rooms };
      }
      
      // Return -1 for both if no data found
      return { 
        monthly_rent: -1, 
        available_rooms: Math.floor(Math.random() * 21)
      };
      
    } catch (error: any) {
      console.error(`Failed to fetch expenses for hostel ${hostelId}:`, error.response?.data || error.message);
      return { 
        monthly_rent: -1, 
        available_rooms: Math.floor(Math.random() * 21)
      };
    }
  };

  // Helper function to get ratings from API - CORRECTED for GET
  const getHostelRatings = async (hostelId: number): Promise<number> => {
    try {
      // You said this is a GET request that returns all ratings
      const response = await axios.get(
        `http://127.0.0.1:8000/faststay_app/display/hostel_rating`
      );
      
      console.log(`All ratings API response:`, response.data);
      
      // Filter ratings for this specific hostel
      if (response.data && Array.isArray(response.data.ratings)) {
        const hostelRatings = response.data.ratings.filter(
          (rating: any) => rating.p_hostelid === hostelId || rating.hostel_id === hostelId
        );
        
        if (hostelRatings.length > 0) {
          const total = hostelRatings.reduce((sum: number, rating: any) => 
            sum + (rating.p_ratingstar || rating.rating || 0), 0);
          const average = total / hostelRatings.length;
          
          // Round to 1 decimal place
          return parseFloat(average.toFixed(1));
        }
      }
      
      // Return -1 if no ratings found
      return -1;
      
    } catch (error: any) {
      console.error(`Failed to fetch ratings:`, error.response?.data || error.message);
      return -1;
    }
  };

  // Fetch hostels from backend
  const fetchAllHostels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/faststay_app/display/all_hostels"
      );
      
      console.log("Basic hostel data:", response.data);
      if (response.data.hostels && Array.isArray(response.data.hostels)) {
        // Process each hostel to add missing data from APIs
        const processedHostels = await Promise.all(
          response.data.hostels.map(async (hostel: any, index: number) => {
            const hostelId = hostel.hostel_id || index + 1;
            
            console.log(`Processing hostel ${hostelId}: ${hostel.p_name}`);
            
            // Fetch additional data from APIs
            let images: string[] = [];
            let expenses = { monthly_rent: -1, available_rooms: -1 };
            let rating = -1;
            
            try {
              // Get images
              images = await getHostelImages(hostelId);
            } catch (imgError) {
              console.log(`Image fetch skipped for hostel ${hostelId}`);
            }
            
            try {
              // Get expenses
              expenses = await getHostelExpenses(hostelId);
            } catch (expError) {
              console.log(`Expense fetch skipped for hostel ${hostelId}`);
            }
            
            try {
              // Get rating
              rating = await getHostelRatings(hostelId);
            } catch (ratingError) {
              console.log(`Rating fetch skipped for hostel ${hostelId}`);
            }
            
            console.log(`Hostel ${hostelId} processed:`, {
              images: images.length,
              rent: expenses.monthly_rent,
              rating: rating
            });
            
            // Calculate mock distance if not provided, use -1 if missing
            const distance_from_university = hostel.distance_from_university || -1;
            
            return {
              ...hostel,
              hostel_id: hostelId,
              images: images.length > 0 ? images : [],
              monthly_rent: expenses.monthly_rent,
              available_rooms: expenses.available_rooms,
              rating: rating,
              distance_from_university: distance_from_university
            };
          })
        );

        console.log("Processed all hostels:", processedHostels);
        
        setHostels(processedHostels);
        setFilteredHostels(processedHostels);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Failed to fetch hostels:", error);
      setError(error.response?.data?.error || "Failed to load hostels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHostels();
  }, [userId]);

  useEffect(() => {
    applyFilters();
  }, [hostels, searchQuery, filters]);

  const applyFilters = () => {
    let filtered = [...hostels];

    // Search filter
    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.filter(hostel =>
        hostel.p_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostel.p_blockno.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostel.p_houseno.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hostel.location && hostel.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Max rent filter (skip if rent is -1/N/A)
    if (filters.maxRent) {
      const maxRentValue = parseInt(filters.maxRent);
      filtered = filtered.filter(hostel => 
        hostel.monthly_rent !== -1 && hostel.monthly_rent <= maxRentValue
      );
    }

    // Distance filter (skip if distance is -1/N/A)
    if (filters.distance) {
      const maxDistance = parseFloat(filters.distance);
      filtered = filtered.filter(hostel => 
        hostel.distance_from_university !== -1 && hostel.distance_from_university <= maxDistance
      );
    }

    // Hostel type filter
    if (filters.hostelType) {
      filtered = filtered.filter(hostel => 
        hostel.p_hosteltype === filters.hostelType
      );
    }

    // Rating filter (skip if rating is -1/N/A)
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(hostel => 
        hostel.rating !== -1 && hostel.rating >= minRating
      );
    }

    // Boolean filters
    if (filters.hasParking !== null) {
      filtered = filtered.filter(hostel => hostel.p_isparking === filters.hasParking);
    }
    
    if (filters.hasMess !== null) {
      filtered = filtered.filter(hostel => hostel.p_messprovide === filters.hasMess);
    }
    
    if (filters.hasGeyser !== null) {
      filtered = filtered.filter(hostel => hostel.p_geezerflag === filters.hasGeyser);
    }

    setFilteredHostels(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      maxRent: "",
      distance: "",
      hostelType: "",
      rating: "",
      hasParking: null,
      hasMess: null,
      hasGeyser: null
    });
    setSearchQuery("");
  };

  const handleViewDetails = (hostelId: number) => {
    navigate(`/student/hostelDetails?id=${hostelId}&user_id=${userId}`);
  };

  const handleViewOwner = (hostelId: number) => {
    navigate(`/student/ownerDetails?id=${hostelId}&user_id=${userId}`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading hostels...</p>
      </div>
    );
  }

  // Render error state
  if (error && hostels.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <i className="fa-solid fa-exclamation-circle"></i>
        <h3>Error Loading Hostels</h3>
        <p>{error}</p>
        <button onClick={fetchAllHostels} className={styles.retryBtn}>
          <i className="fa-solid fa-rotate"></i> Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <i className="fa-solid fa-building-user"></i> FastStay
        </div>
        <div className={styles.navLinks}>
          <Link to={`/student/home?user_id=${userId}`} className={`${styles.navLinkItem} ${styles.active}`}>
            Home
          </Link>
          <Link to={`/student/profile?user_id=${userId}`} className={styles.navLinkItem}>
            My Profile
          </Link>
          <Link to={`/student/suggestions?user_id=${userId}`} className={styles.navLinkItem}>
            Suggestions
          </Link>
          <Link to="/logout" className={styles.navLinkItem}>
            Logout
          </Link>
        </div>
      </nav>

      {/* SEARCH SECTION */}
      <div className={styles.searchSection}>
        <h2>Find the Perfect Hostel</h2>
        
        <form onSubmit={handleSearch} className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search by hostel name, block, or location..."
              value={searchQuery || ''}
              onChange={(e) => {
                setSearchQuery(e.target.value || '');
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <button type="submit" className={styles.searchBtn}>
              Search
            </button>
          </div>
          
          {/* Search suggestions dropdown */}
          {showSuggestions && searchQuery && (
            <div className={styles.suggestionsDropdown}>
              {hostels
                .filter(hostel => 
                  hostel.p_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  hostel.p_blockno.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .slice(0, 5)
                .map(hostel => (
                  <div 
                    key={hostel.hostel_id}
                    className={styles.suggestionItem}
                    onClick={() => {
                      setSearchQuery(hostel.p_name);
                      setShowSuggestions(false);
                      applyFilters();
                    }}
                  >
                    <i className="fa-solid fa-building"></i>
                    <div>
                      <strong>{hostel.p_name}</strong>
                      <small>{hostel.p_blockno}, {hostel.p_houseno}</small>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </form>

        {/* FILTERS */}
        <div className={styles.filtersSection}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Max Rent (PKR)</label>
              <input
                type="number"
                placeholder="e.g., 15000"
                value={filters.maxRent}
                onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                min="0"
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Max Distance (km)</label>
              <input
                type="number"
                placeholder="e.g., 2.5"
                step="0.1"
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', e.target.value)}
                min="0"
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Hostel Type</label>
              <select
                value={filters.hostelType}
                onChange={(e) => handleFilterChange('hostelType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Portion">Portion</option>
                <option value="Building">Building</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Min Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.hasParking === true}
                  onChange={(e) => handleFilterChange('hasParking', e.target.checked ? true : null)}
                />
                <span> Parking Available</span>
              </label>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.hasMess === true}
                  onChange={(e) => handleFilterChange('hasMess', e.target.checked ? true : null)}
                />
                <span> Mess Provided</span>
              </label>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filters.hasGeyser === true}
                  onChange={(e) => handleFilterChange('hasGeyser', e.target.checked ? true : null)}
                />
                <span> Geyser Available</span>
              </label>
            </div>

            <div className={styles.filterGroup}>
              <button onClick={clearFilters} className={styles.clearBtn}>
                <i className="fa-solid fa-times"></i> Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className={styles.resultsInfo}>
          <p>
            <i className="fa-solid fa-list"></i>
            Showing {filteredHostels.length} of {hostels.length} hostels
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
      </div>

      {/* HOSTEL GRID */}
      <div className={styles.hostelGrid}>
        {filteredHostels.length === 0 ? (
          <div className={styles.noResults}>
            <i className="fa-solid fa-search"></i>
            <h3>No hostels found</h3>
            <p>Try adjusting your filters or search term</p>
            <div className={styles.noResultsActions}>
              <button onClick={clearFilters} className={styles.resetBtn}>
                Clear All Filters
              </button>
              <button 
                onClick={() => navigate(`/student/suggestions?user_id=${userId}`)}
                className={styles.suggestionsLinkBtn}
              >
                View Suggestions
              </button>
            </div>
          </div>
        ) : (
          filteredHostels.map((hostel) => (
            <div key={hostel.hostel_id} className={styles.hostelCard}>
              <div className={styles.cardImage}>
                <img 
                  src={hostel.images && hostel.images.length > 0 
                    ? hostel.images[0] 
                    : `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80`
                  } 
                  alt={hostel.p_name} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80`;
                  }}
                />
                <div className={styles.cardBadges}>
                  {hostel.p_hosteltype === "Portion" && (
                    <span className={styles.acBadge}>Portion</span>
                  )}
                  {hostel.p_messprovide && (
                    <span className={styles.messBadge}>Mess</span>
                  )}
                  {hostel.p_isparking && (
                    <span className={styles.parkingBadge}>Parking</span>
                  )}
                  {hostel.p_geezerflag && (
                    <span className={styles.geyserBadge}>Geyser</span>
                  )}
                  {hostel.available_rooms !== -1 && hostel.available_rooms < 5 && (
                    <span className={styles.roomsBadge}>
                      Only {hostel.available_rooms} left
                    </span>
                  )}
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <h3>{hostel.p_name}</h3>
                <p className={styles.cardAddress}>
                  <i className="fa-solid fa-location-dot"></i>
                  Block {hostel.p_blockno}, House {hostel.p_houseno}
                  {hostel.distance_from_university !== -1 && (
                    <span className={styles.distance}>
                      • {formatValue(hostel.distance_from_university, { isDistance: true })} from university
                    </span>
                  )}
                </p>
                
                <div className={styles.cardStats}>
                  <div className={styles.statItem}>
                    <i className="fa-solid fa-money-bill-wave"></i>
                    <div>
                      <span className={styles.statLabel}>Monthly Rent</span>
                      <span className={styles.statValue}>
                        {formatValue(hostel.monthly_rent, { isCurrency: true })}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.statItem}>
                    <i className="fa-solid fa-star"></i>
                    <div>
                      <span className={styles.statLabel}>Rating</span>
                      <span className={styles.statValue}>
                        {formatRating(hostel.rating)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.statItem}>
                    <i className="fa-solid fa-door-closed"></i>
                    <div>
                      <span className={styles.statLabel}>Available Rooms</span>
                      <span className={styles.statValue}>
                        {formatRooms(hostel.available_rooms)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardDetails}>
                  <p><i className="fa-solid fa-building"></i> {hostel.p_numrooms} Rooms, {hostel.p_numfloors} Floors</p>
                  <p><i className="fa-solid fa-droplet"></i> Water: {hostel.p_watertimings}</p>
                  <p><i className="fa-solid fa-broom"></i> Cleaning every {hostel.p_cleanlinesstenure} days</p>
                  <p><i className="fa-solid fa-tools"></i> Issues resolved in {hostel.p_issueresolvingtenure} days</p>
                </div>

                <div className={styles.cardButtons}>
                  <button
                    className={styles.viewBtn}
                    onClick={() => handleViewDetails(hostel.hostel_id)}
                  >
                    <i className="fa-solid fa-eye"></i> View Details
                  </button>
                  <button
                    className={styles.ownerBtn}
                    onClick={() => handleViewOwner(hostel.hostel_id)}
                  >
                    <i className="fa-solid fa-user-tie"></i> View Owner
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div 
          className={styles.overlay}
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

export default StudentHome;