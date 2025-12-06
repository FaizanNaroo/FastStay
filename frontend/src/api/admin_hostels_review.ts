// import axios, { AxiosError } from "axios";

// const API_BASE_URL = "http://127.0.0.1:8000";

// /* ============================ RAW API INTERFACES ============================ */

// export interface RawHostel {
//     p_hostelid: number;
//     p_managerid: number;
//     p_blockno: string;
//     p_houseno: string;
//     p_hosteltype: string;
//     p_isparking: boolean;
//     p_numrooms: number;
//     p_numfloors: number;
//     p_watertimings: number;
//     p_cleanlinesstenure: number;
//     p_issueresolvingtenure: number;
//     p_messprovide: boolean;
//     p_geezerflag: boolean;
//     p_name: string;
// }

// export interface HostelApiResponse {
//     hostels: RawHostel[];
// }

// export interface RawUser {
//     userid: number;
//     fname: string;
//     lname: string;
//     usertype: string;
// }

// export interface UsersApiResponse {
//     users: RawUser[];
// }

// export interface HostelPicResponse {
//     p_photolink: string;
// }

// /* ======================== FINAL MERGED TABLE DATA ======================== */

// export interface HostelTableRow {
//     id: number;
//     name: string;
//     managerName: string;
//     hostelType: string;
//     rooms: number;
//     floors: number;
//     waterTiming: number;
//     cleaningTenure: number;
//     issueResolveDays: number;
//     parking: boolean;
//     mess: boolean;
//     geezer: boolean;
//     image?: string;   // fetched separately
// }

// /* ============================ API FUNCTIONS ============================ */

// // Fetch pic by hostel ID
// const getHostelImage = async (id: number): Promise<string | null> => {
//     try {
//         const res = await axios.get<HostelPicResponse>(`${API_BASE_URL}/faststay_app/display/hostel_pic?hostelid=${id}`);
//         return res.data.p_photolink || null;
//     } catch {
//         return null;
//     }
// };

// export const getAllHostelsTableData = async (): Promise<HostelTableRow[]> => {
//     try {
//         const [hostelRes, usersRes] = await Promise.all([
//             axios.get<HostelApiResponse>(`${API_BASE_URL}/faststay_app/display/all_hostels`),
//             axios.get<UsersApiResponse>(`${API_BASE_URL}/faststay_app/users/all`)
//         ]);

//         const hostels = hostelRes.data.hostels || [];
//         const users = usersRes.data.users || [];

//         const finalData: HostelTableRow[] = await Promise.all(
//             hostels.map(async (h) => {
//                 const matchedUser = users.find(u => u.userid === h.p_managerid);
//                 const imgUrl = await getHostelImage(h.p_hostelid);

//                 return {
//                     id: h.p_hostelid,
//                     name: h.p_name,
//                     managerName: matchedUser ? `${matchedUser.fname} ${matchedUser.lname}` : "Unknown Manager",
//                     hostelType: h.p_hosteltype,
//                     rooms: h.p_numrooms,
//                     floors: h.p_numfloors,
//                     waterTiming: h.p_watertimings,
//                     cleaningTenure: h.p_cleanlinesstenure,
//                     issueResolveDays: h.p_issueresolvingtenure,
//                     parking: h.p_isparking,
//                     mess: h.p_messprovide,
//                     geezer: h.p_geezerflag,
//                     image: imgUrl || undefined
//                 };
//             })
//         );

//         return finalData;

//     } catch (error: unknown) {
//         console.error("Error fetching hostel data:", error);

//         if (axios.isAxiosError(error)) {
//             const err = error as AxiosError;
//             console.error("Axios Response:", err.response?.data);
//         }

//         return [];
//     }
// };








// import axios, { AxiosError } from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:8000';

// // ---- RAW Response Interfaces ----

// interface RawHostel {
//     p_hostelid: number;
//     p_managerid: number;
//     p_blockno: string;
//     p_houseno: string;
//     p_hosteltype: string;
//     p_isparking: boolean;
//     p_numrooms: number;
//     p_numfloors: number;
//     p_watertimings: number;
//     p_cleanlinesstenure: number;
//     p_issueresolvingtenure: number;
//     p_messprovide: boolean;
//     p_geezerflag: boolean;
//     p_name: string;
// }

// interface HostelsApiResponse {
//     hostels: RawHostel[];
// }

// interface RawHostelPic {
//     p_photolink: string;
// }

// interface RawManager {
//     p_ManagerId: number;
//     p_PhotoLink: string;
//     p_PhoneNo: string;
//     p_Education: string;
//     p_ManagerType: string;
//     p_OperatingHours: number;
// }

// interface ManagerApiResponse {
//     success: boolean;
//     result: RawManager[];
// }

// interface RawUser {
//     userid: number;
//     fname: string;
//     lname: string;
//     usertype: string;
// }

// interface UsersApiResponse {
//     users: RawUser[];
// }

// // ---- Final Frontend Table Interface ----
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

// // ---- Main Function (Return Full Hostel Data) ----
// export const getAllHostelsTableData = async (): Promise<HostelTableRow[]> => {
//     try {
//         // Fetch all necessary data in parallel
//         const [hostelsRes, managersRes, usersRes] = await Promise.all([
//             axios.get<HostelsApiResponse>(`${API_BASE_URL}/faststay_app/display/all_hostels`),
//             axios.get<ManagerApiResponse>(`${API_BASE_URL}/faststay_app/ManagerDetails/display/all`),
//             axios.get<UsersApiResponse>(`${API_BASE_URL}/faststay_app/users/all`)
//         ]);

//         const hostels = hostelsRes.data.hostels || [];
//         const managers = managersRes.data.result || [];
//         const users = usersRes.data.users || [];

//         // Map hostels to final frontend structure
//         const finalData: HostelTableRow[] = await Promise.all(hostels.map(async hostel => {
//             // Get hostel photos
//             const photos: string[] = [];
//             try {
//                 const picRes = await axios.get<RawHostelPic>(`${API_BASE_URL}/faststay_app/display/hostel_pic?id=${hostel.p_hostelid}`);
//                 photos.push(picRes.data.p_photolink);
//             } catch (e) {
//                 console.error(`Error fetching photos for hostel ${hostel.p_hostelid}`, e);
//             }

//             // Get manager info
//             const manager = managers.find(m => m.p_ManagerId === hostel.p_managerid);
//             const user = users.find(u => u.userid === hostel.p_managerid);

//             return {
//                 id: hostel.p_hostelid,
//                 name: hostel.p_name,
//                 blockNo: hostel.p_blockno,
//                 houseNo: hostel.p_houseno,
//                 type: hostel.p_hosteltype,
//                 parking: hostel.p_isparking,
//                 rooms: hostel.p_numrooms,
//                 floors: hostel.p_numfloors,
//                 waterTimings: `${hostel.p_watertimings} hrs`,
//                 cleanlinessTenure: `${hostel.p_cleanlinesstenure} days`,
//                 issueResolvingTenure: `${hostel.p_issueresolvingtenure} days`,
//                 messProvide: hostel.p_messprovide,
//                 geezer: hostel.p_geezerflag,
//                 photos,
//                 managerName: user ? `${user.fname} ${user.lname}` : 'Unknown',
//                 managerPhone: manager?.p_PhoneNo || 'N/A',
//                 managerType: manager?.p_ManagerType || 'N/A',
//                 managerEducation: manager?.p_Education || 'N/A'
//             };
//         }));

//         return finalData;

//     } catch (error: unknown) {
//         console.error("Error fetching hostel data:", error);

//         if (axios.isAxiosError(error)) {
//             const err = error as AxiosError;
//             console.error("Axios Response:", err.response?.data);
//         }
//         return [];
//     }
// };







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

interface RawHostelPic {
    p_photolink: string;
}

interface HostelPicsApiResponse {
    success: boolean;
    result: RawHostelPic[];
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
}

// ---- NEW: Function to get hostel pictures by ID ----
export const getHostelPictures = async (hostelId: number): Promise<string[]> => {
    try {
        // Using POST method as shown in your API requirement
        const response = await axios.post<HostelPicsApiResponse>(
            `${API_BASE_URL}/faststay_app/display/hostel_pic`,
            {
                p_HostelId: hostelId
            }
        );

        if (response.data.success && response.data.result) {
            // Extract photo links from the response
            return response.data.result.map(pic => pic.p_photolink);
        }
        
        return [];
        
    } catch (error: unknown) {
        console.error(`Error fetching pictures for hostel ${hostelId}:`, error);
        
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError;
            console.error("Axios Response:", err.response?.data);
        }
        return [];
    }
};

// ---- Alternative GET method if you prefer GET instead of POST ----
export const getHostelPicturesGET = async (hostelId: number): Promise<string[]> => {
    try {
        // Using GET method with query parameter
        const response = await axios.get<HostelPicsApiResponse>(
            `${API_BASE_URL}/faststay_app/display/hostel_pic`,
            {
                params: { id: hostelId } // Assuming your backend uses 'id' parameter for GET
            }
        );

        if (response.data.success && response.data.result) {
            return response.data.result.map(pic => pic.p_photolink);
        }
        
        return [];
        
    } catch (error: unknown) {
        console.error(`Error fetching pictures for hostel ${hostelId}:`, error);
        return [];
    }
};

// ---- Updated Main Function with improved picture fetching ----
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

// ---- NEW: Function to get single hostel details with pictures ----
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