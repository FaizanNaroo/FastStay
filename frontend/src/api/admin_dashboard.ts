import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

interface User {
  usertype: string;
}

export const getDashboardSummary = async () => {
  try {
    // TypeScript will infer the types automatically
    const [usersResponse, hostelsResponse, roomsResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/faststay_app/users/all/`),
      axios.get(`${API_BASE_URL}/faststay_app/display/all_hostels`),
      axios.get(`${API_BASE_URL}/faststay_app/display/all_rooms`)
    ]);
    
    const users = usersResponse.data?.users || [];
    const total_hostels = hostelsResponse.data?.count || 0;
    const total_rooms = roomsResponse.data?.count || 0;
    
    const total_students = users.filter((user: User) => 
      user.usertype === 'Student'
    ).length;
    
    const total_managers = users.filter((user: User) => 
      user.usertype === 'Hostel Manager'
    ).length;
    
    return {
      total_students,
      total_managers,
      total_hostels,
      total_rooms,
    };
    
  } catch (error: unknown) {
  console.error("Error fetching dashboard summary:", error);
  
  // Type-safe error handling
  if (error instanceof Error) {
    console.error("Error message:", error.message);
  }
  
  return {
    total_students: 0,
    total_managers: 0,
    total_hostels: 0,
    total_rooms: 0,
  };
  }
};





interface RawUser {
    userid: number; 
    usertype: string;
    fname: string;
    lname: string;
    city: string;
    // ... potentially other fields like loginid, age, gender
}

// 2. Interface for the API response structure for the users endpoint
interface UsersApiResponse {
    users: RawUser[];
    count: number;
}

// 3. Interface for the final, formatted data the React component will use for the table
export interface RecentUserAccount {
    userid:number;
    Name: string; // Combined 'fname' and 'lname'
    City: string;
    UserType: string; // The 'usertype' field
}


export const getRecentUsersTableData = async (limit: number = 10): Promise<RecentUserAccount[]> => {
    try {

        const response = await axios.get<UsersApiResponse>(
            `${API_BASE_URL}/faststay_app/users/all/`
        );

        const allUsers = response.data?.users || [];
        
        const sortedUsers = [...allUsers].sort((a, b) => b.userid - a.userid);

        const recentUsers = sortedUsers.slice(0, limit);

        const recentUserAccounts: RecentUserAccount[] = recentUsers.map(user => ({
            userid: user.userid, // Used for 'View' button action
            Name: `${user.fname} ${user.lname}`, // Combine first and last name
            City: user.city,
            UserType: user.usertype, // Include the user type
        }));

        return recentUserAccounts;

    } catch (error: unknown) {
        console.error("Error fetching and processing recent users:", error);
        // ... (Standard error handling)
        if (error instanceof Error) {
            console.error("Error message:", error.message);
        }
        return []; // Return an empty array on failure
    }
}



// Interface for raw hostel data from API
interface RawHostel {
  p_hostelid: number;
  p_managerid: number;
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
}

// Interface for API response structure
interface HostelsApiResponse {
  hostels: RawHostel[];
  count: number;
}

// Interface for manager data
interface ManagerData {
  userid: number;
  fname: string;
  lname: string;
}

// Interface for final formatted hostel data
export interface RecentHostel {
  hostelId: number;
  hostelName: string;
  houseNo: string;  // Changed from city to house number
  hostelType: string;
  managerName: string; // Manager name fetched from users endpoint
  totalRooms: number;
  action: string; // For view button
}

export const getRecentHostelsTableData = async (limit: number = 10): Promise<RecentHostel[]> => {
  try {
    // Fetch hostels data
    const hostelsResponse = await axios.get<HostelsApiResponse>(
      `${API_BASE_URL}/faststay_app/display/all_hostels`
    );

    const allHostels = hostelsResponse.data?.hostels || [];
    
    // Sort hostels by ID (assuming higher ID = more recent)
    const sortedHostels = [...allHostels].sort((a, b) => b.p_hostelid - a.p_hostelid);
    
    // Get only recent hostels
    const recentHostels = sortedHostels.slice(0, limit);
    
    // Fetch all users to get manager names
    const usersResponse = await axios.get<{ users: ManagerData[] }>(
      `${API_BASE_URL}/faststay_app/users/all/`
    );
    
    const allUsers = usersResponse.data?.users || [];
    
    // Create a map of manager IDs to manager names for quick lookup
    const managerMap = new Map<number, string>();
    
    allUsers.forEach(user => {
      managerMap.set(user.userid, `${user.fname} ${user.lname}`);
    });
    
    // Format the recent hostels data
    const recentHostelList: RecentHostel[] = recentHostels.map(hostel => {
      // Get manager name from the map, fallback to "Unknown" if not found
      const managerName = managerMap.get(hostel.p_managerid) || "Unknown Manager";
      
      return {
        hostelId: hostel.p_hostelid,
        hostelName: hostel.p_name || "Unnamed Hostel",
        houseNo: hostel.p_houseno, // Using house number instead of city
        hostelType: hostel.p_hosteltype,
        managerName: managerName,
        totalRooms: hostel.p_numrooms,
        action: "View Details" // Default text for action button
      };
    });

    return recentHostelList;

  } catch (error: unknown) {
    console.error("Error fetching and processing recent hostels:", error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    
    return []; // Return an empty array on failure
  }
};