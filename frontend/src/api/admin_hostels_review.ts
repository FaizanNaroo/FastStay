import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// ---- RAW Response Interfaces ----

interface RawHostel {
    p_hostelid: number;
    p_managerid: number;
    p_blockno: string;
    p_houseno: string;
    p_hosteltype: string;
    p_isparking: boolean;
    p_numrooms: number;
    p_numfloors: number;
    p_watertimings: number;
    p_cleanlinesstenure: number;
    p_issueresolvingtenure: number;
    p_messprovide: boolean;
    p_geezerflag: boolean;
    p_name: string;
}

interface HostelsApiResponse {
    hostels: RawHostel[];
}

interface RawManager {
    p_ManagerId: number;
    p_PhotoLink: string;
    p_PhoneNo: string;
    p_Education: string;
    p_ManagerType: string;
    p_OperatingHours: number;
}

interface ManagerApiResponse {
    success: boolean;
    result: RawManager[];
}

interface RawUser {
    userid: number;
    fname: string;
    lname: string;
    usertype: string;
}

interface UsersApiResponse {
    users: RawUser[];
}

 // ---- Final Frontend Table Interface ----
// export interface HostelTableRow {
//     id: number;
//     name: string;
//     blockNo: string;
//     houseNo: string;
//     type: string;
//     parking: boolean;
//     rooms: number;
//     floors: number;
//     waterTimings: string;
//     cleanlinessTenure: string;
//     issueResolvingTenure: string;
//     messProvide: boolean;
//     geezer: boolean;
//     photos: string[];
//     managerName: string;
//     managerPhone: string;
//     managerType: string;
//     managerEducation: string;
// }

export interface HostelTableRow {
    id: number;
    name: string;
    blockNo: string;
    houseNo: string;
    type: string;
    parking: boolean;
    rooms: number;
    floors: number;
    waterTimings: string;
    cleanlinessTenure: string;
    issueResolvingTenure: string;
    messProvide: boolean;
    geezer: boolean;
    photos: string[];
    managerName: string;
    managerPhone: string;
    managerType: string;
    managerEducation: string;
    approved?: boolean; // Add this field
}

// ---- Approve Hostel ----
export const approveHostel = async (hostelId: number): Promise<boolean> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/faststay_app/hosteldetails/approve`,
            { p_hostelid: hostelId }
        );
        return response.data.success || false;
    } catch (error: unknown) {
        console.error(`Error approving hostel ${hostelId}:`, error);
        if (axios.isAxiosError(error)) {
            console.error("Axios Response:", error.response?.data);
        }
        return false;
    }
};

// In your admin_hostels_review.ts file, update the deleteHostel function:

export const deleteHostel = async (hostelId: number): Promise<boolean> => {
    try {
        console.log(`Attempting to delete hostel with ID: ${hostelId}`);
        
        // Use POST method as your Django view expects POST
        // Send p_HostelId (with capital H) as per your Django view
        const response = await axios.post(
            `${API_BASE_URL}/faststay_app/hosteldetails/delete`,
            { p_HostelId: hostelId.toString() }, // Convert to string as your backend expects
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log("Delete API Response:", response.data);
        
        // Your backend returns different response formats based on success/failure
        // Check for success messages
        if (response.status === 200 && response.data.message) {
            // Success response: {'message': f'Hostel ID {hostel_id} successfully deleted'}
            return true;
        } else if (response.status === 404) {
            // Not found response
            console.error("Hostel not found:", response.data.error);
            return false;
        } else if (response.status === 500) {
            // Server error response
            console.error("Server error:", response.data.error);
            return false;
        }
        
        return false;
        
    } catch (error: unknown) {
        console.error(`Error deleting hostel ${hostelId}:`, error);
        
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error("Axios Error Details:", {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                message: axiosError.message
            });
            
            // Check for specific error responses from your backend
            if (axiosError.response?.status === 404) {
                console.log("Hostel not found - 404 error");
            } else if (axiosError.response?.status === 400) {
                console.log("Bad request - 400 error");
            }
        }
        return false;
    }
};



// ---- CORRECTED: Function to get hostel pictures by ID ----
export const getHostelPictures = async (hostelId: number): Promise<string[]> => {
    try {
        // Using GET method with query parameter as shown in your working example
        const response = await axios.get(
            `${API_BASE_URL}/faststay_app/display/hostel_pic`,
            {
                params: { p_HostelId: hostelId }
            }
        );

        console.log("Hostel pics response for ID", hostelId, ":", response.data); // Debug log

        let images: string[] = [];

        // Handle the response based on the actual structure
        if (Array.isArray(response.data)) {
            // If response is an array (like your working example suggests)
            images = response.data.map((item: any) => item.p_photolink);
        } else if (response.data?.p_photolink) {
            // If response is a single object with p_photolink
            images = [response.data.p_photolink];
        } else if (response.data && typeof response.data === 'object') {
            // If response is an object that might have the photo link
            images = [response.data.p_photolink].filter(Boolean);
        }

        console.log("Extracted images:", images); // Debug log
        return images;
        
    } catch (error: unknown) {
        console.error(`Error fetching pictures for hostel ${hostelId}:`, error);
        
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError;
            console.error("Axios Response:", err.response?.data);
        }
        return [];
    }
};

// ---- Updated Main Function ----
export const getAllHostelsTableData = async (): Promise<HostelTableRow[]> => {
    try {
        // Fetch all necessary data in parallel
        const [hostelsRes, managersRes, usersRes] = await Promise.all([
            axios.get<HostelsApiResponse>(`${API_BASE_URL}/faststay_app/display/all_hostels`),
            axios.get<ManagerApiResponse>(`${API_BASE_URL}/faststay_app/ManagerDetails/display/all`),
            axios.get<UsersApiResponse>(`${API_BASE_URL}/faststay_app/users/all`)
        ]);

        const hostels = hostelsRes.data.hostels || [];
        const managers = managersRes.data.result || [];
        const users = usersRes.data.users || [];

        // Map hostels to final frontend structure
        const finalData: HostelTableRow[] = await Promise.all(hostels.map(async hostel => {
            // Get hostel photos using the new function
            const photos: string[] = await getHostelPictures(hostel.p_hostelid);

            // Get manager info
            const manager = managers.find(m => m.p_ManagerId === hostel.p_managerid);
            const user = users.find(u => u.userid === hostel.p_managerid);

            return {
                id: hostel.p_hostelid,
                name: hostel.p_name,
                blockNo: hostel.p_blockno,
                houseNo: hostel.p_houseno,
                type: hostel.p_hosteltype,
                parking: hostel.p_isparking,
                rooms: hostel.p_numrooms,
                floors: hostel.p_numfloors,
                waterTimings: `${hostel.p_watertimings} hrs`,
                cleanlinessTenure: `${hostel.p_cleanlinesstenure} days`,
                issueResolvingTenure: `${hostel.p_issueresolvingtenure} days`,
                messProvide: hostel.p_messprovide,
                geezer: hostel.p_geezerflag,
                photos,
                managerName: user ? `${user.fname} ${user.lname}` : 'Unknown',
                managerPhone: manager?.p_PhoneNo || 'N/A',
                managerType: manager?.p_ManagerType || 'N/A',
                managerEducation: manager?.p_Education || 'N/A'
            };
        }));

        console.log("Final hostel data with photos:", finalData); // Debug log
        return finalData;

    } catch (error: unknown) {
        console.error("Error fetching hostel data:", error);

        if (axios.isAxiosError(error)) {
            const err = error as AxiosError;
            console.error("Axios Response:", err.response?.data);
        }
        return [];
    }
};

// ---- CORRECTED: Function to get single hostel details with pictures ----
export const getHostelDetails = async (hostelId: number): Promise<HostelTableRow | null> => {
    try {
        // Fetch hostel details
        const hostelRes = await axios.get<HostelsApiResponse>(`${API_BASE_URL}/faststay_app/display/all_hostels`);
        const hostel = hostelRes.data.hostels.find(h => h.p_hostelid === hostelId);
        
        if (!hostel) {
            console.error(`Hostel with ID ${hostelId} not found`);
            return null;
        }

        // Fetch photos for this specific hostel
        const photos: string[] = await getHostelPictures(hostelId);

        // Fetch manager and user data
        const [managersRes, usersRes] = await Promise.all([
            axios.get<ManagerApiResponse>(`${API_BASE_URL}/faststay_app/ManagerDetails/display/all`),
            axios.get<UsersApiResponse>(`${API_BASE_URL}/faststay_app/users/all`)
        ]);

        const managers = managersRes.data.result || [];
        const users = usersRes.data.users || [];

        const manager = managers.find(m => m.p_ManagerId === hostel.p_managerid);
        const user = users.find(u => u.userid === hostel.p_managerid);

        return {
            id: hostel.p_hostelid,
            name: hostel.p_name,
            blockNo: hostel.p_blockno,
            houseNo: hostel.p_houseno,
            type: hostel.p_hosteltype,
            parking: hostel.p_isparking,
            rooms: hostel.p_numrooms,
            floors: hostel.p_numfloors,
            waterTimings: `${hostel.p_watertimings} hrs`,
            cleanlinessTenure: `${hostel.p_cleanlinesstenure} days`,
            issueResolvingTenure: `${hostel.p_issueresolvingtenure} days`,
            messProvide: hostel.p_messprovide,
            geezer: hostel.p_geezerflag,
            photos,
            managerName: user ? `${user.fname} ${user.lname}` : 'Unknown',
            managerPhone: manager?.p_PhoneNo || 'N/A',
            managerType: manager?.p_ManagerType || 'N/A',
            managerEducation: manager?.p_Education || 'N/A'
        };

    } catch (error: unknown) {
        console.error(`Error fetching hostel ${hostelId} details:`, error);
        return null;
    }
};