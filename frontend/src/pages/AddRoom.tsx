import { useState, useEffect } from "react";
import styles from "../styles/AddRoom.module.css";
import { Link } from "react-router-dom";

interface Hostel {
    p_HostelId: number;
    p_name: string;
    p_BlockNo: string;
    p_HouseNo: string;
    p_HostelType: string;
}

interface Room {
    p_RoomNo: number;
    p_HostelId: number;
    p_FloorNo: number;
    p_SeaterNo: number;
    p_RoomRent: number;
    p_BedType: string;
    p_WashroomType: string;
    p_CupboardType: string;
    p_isVentilated: boolean;
    p_isCarpet: boolean;
    p_isMiniFridge: boolean;
}

export default function AddRoom() {
    const params = new URLSearchParams(window.location.search);
    const managerId = Number(params.get("user_id"));
    
    const [hostels, setHostels] = useState<Hostel[]>([]);
    const [selectedHostelId, setSelectedHostelId] = useState<number | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [currentRoomNo, setCurrentRoomNo] = useState<number | null>(null); // Track room being edited
    
    // Room form state
    const [roomForm, setRoomForm] = useState({
        p_RoomNo: "",
        p_HostelId: "",
        p_FloorNo: "",
        p_SeaterNo: "",
        p_RoomRent: "",
        p_BedType: "",
        p_WashroomType: "",
        p_CupboardType: "",
        p_isVentilated: false,
        p_isCarpet: false,
        p_isMiniFridge: false
    });

    // Fetch hostels for this manager
    useEffect(() => {
        async function fetchHostels() {
            try {
                const res = await fetch("http://127.0.0.1:8000/faststay_app/display/all_hostels");
                const data = await res.json();

                if (data?.hostels) {
                    // Filter hostels by managerId
                    const filteredHostels = data.hostels
                        .filter((h: any) => h.p_managerid === managerId)
                        .map((h: any) => ({
                            p_HostelId: h.p_hostelid,
                            p_name: h.p_name || `Hostel ${h.p_hostelid}`,
                            p_BlockNo: h.p_blockno,
                            p_HouseNo: h.p_houseno,
                            p_HostelType: h.p_hosteltype
                        }));
                    
                    setHostels(filteredHostels);
                }
            } catch (error) {
                console.error("Error fetching hostels:", error);
                setMessage("Failed to load hostels");
            }
        }
        fetchHostels();
    }, [managerId]);

    // Fetch rooms when hostel is selected
    useEffect(() => {
        if (selectedHostelId) {
            fetchRoomsForHostel(selectedHostelId);
        } else {
            setRooms([]);
        }
    }, [selectedHostelId]);

    async function fetchRoomsForHostel(hostelId: number) {
        setLoading(true);
        setMessage("");
        try {
            console.log("Fetching rooms for hostel ID:", hostelId);
            const res = await fetch("http://127.0.0.1:8000/faststay_app/Rooms/DisplayAllHostel/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ p_HostelId: hostelId })
            });
            
            const data = await res.json();
            console.log("Rooms API Response:", data); // Debug log
            
            if (res.ok && data.success) {
                // Check the actual structure of data.result
                console.log("Data result structure:", data.result);
                
                let roomList = [];
                
                // Handle different response structures
                if (Array.isArray(data.result)) {
                    roomList = data.result;
                } else if (data.result && typeof data.result === 'object') {
                    // If it's a single object, wrap it in an array
                    roomList = [data.result];
                }
                
                console.log("Processed room list:", roomList);
                
                // Transform API response to match Room interface
                const roomsWithRoomNo = roomList.map((room: any, index: number) => {
                    console.log("Room data:", room); // Debug each room
                    return {
                        p_RoomNo: room.p_roomno || room.p_RoomNo || room.roomno || (index + 1),
                        p_HostelId: room.p_hostelid || room.p_HostelId || hostelId,
                        p_FloorNo: room.p_floorno || room.p_FloorNo || room.floorno || 1,
                        p_SeaterNo: room.p_seaterno || room.p_SeaterNo || room.seaterno || 1,
                        p_RoomRent: room.p_roomrent || room.p_RoomRent || room.roomrent || 0,
                        p_BedType: room.p_bedtype || room.p_BedType || room.bedtype || "Bed",
                        p_WashroomType: room.p_washroomtype || room.p_WashroomType || room.washroomtype || "Community",
                        p_CupboardType: room.p_cupboardtype || room.p_CupboardType || room.cupboardtype || "Shared",
                        p_isVentilated: room.p_isventilated || room.p_isVentilated || room.isventilated || false,
                        p_isCarpet: room.p_iscarpet || room.p_isCarpet || room.iscarpet || false,
                        p_isMiniFridge: room.p_isminifridge || room.p_isMiniFridge || room.isminifridge || false
                    };
                });
                
                console.log("Final rooms array:", roomsWithRoomNo);
                setRooms(roomsWithRoomNo);
                
                if (roomsWithRoomNo.length === 0) {
                    setMessage("No rooms found for this hostel. Add your first room!");
                }
            } else {
                setRooms([]);
                setMessage(data.error || "No rooms found for this hostel");
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setRooms([]);
            setMessage("Failed to load rooms. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleHostelSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const hostelId = parseInt(e.target.value);
        setSelectedHostelId(hostelId || null);
        setMessage("");
    }

    function openAddModal() {
        setIsEditing(false);
        setCurrentRoomNo(null);
        setRoomForm({
            p_RoomNo: "",
            p_HostelId: selectedHostelId?.toString() || "",
            p_FloorNo: "",
            p_SeaterNo: "",
            p_RoomRent: "",
            p_BedType: "",
            p_WashroomType: "",
            p_CupboardType: "",
            p_isVentilated: false,
            p_isCarpet: false,
            p_isMiniFridge: false
        });
        setShowModal(true);
    }

    function openEditModal(room: Room) {
        console.log("Opening edit modal for room:", room); // Debug log
        
        setIsEditing(true);
        setCurrentRoomNo(room.p_RoomNo);
        
        // Use the exact values from the room object
        setRoomForm({
            p_RoomNo: room.p_RoomNo.toString(),
            p_HostelId: room.p_HostelId.toString(),
            p_FloorNo: room.p_FloorNo.toString(),
            p_SeaterNo: room.p_SeaterNo.toString(),
            p_RoomRent: room.p_RoomRent.toString(),
            p_BedType: room.p_BedType,
            p_WashroomType: room.p_WashroomType,
            p_CupboardType: room.p_CupboardType,
            p_isVentilated: room.p_isVentilated,
            p_isCarpet: room.p_isCarpet,
            p_isMiniFridge: room.p_isMiniFridge
        });
        
        console.log("Form state after setting:", {
            p_RoomNo: room.p_RoomNo.toString(),
            p_BedType: room.p_BedType,
            p_WashroomType: room.p_WashroomType,
            p_CupboardType: room.p_CupboardType
        });
        
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setMessage("");
        setCurrentRoomNo(null);
    }

    function handleRoomFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;
        
        console.log("Form field changed:", name, value, type); // Debug log
        
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setRoomForm(prev => ({ ...prev, [name]: checked }));
        } else {
            setRoomForm(prev => ({ ...prev, [name]: value }));
        }
    }

    async function handleRoomSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");

        // Validate form
        if (!selectedHostelId) {
            setMessage("Please select a hostel first");
            return;
        }

        // Validate required fields
        const requiredFields = ['p_RoomNo', 'p_FloorNo', 'p_SeaterNo', 'p_RoomRent', 'p_BedType', 'p_WashroomType', 'p_CupboardType'];
        const missingFields = requiredFields.filter(field => !roomForm[field as keyof typeof roomForm]);
        
        if (missingFields.length > 0) {
            setMessage(`Please fill in all required fields: ${missingFields.join(', ')}`);
            return;
        }

        const payload = {
            p_RoomNo: parseInt(roomForm.p_RoomNo),
            p_HostelId: selectedHostelId,
            p_FloorNo: parseInt(roomForm.p_FloorNo),
            p_SeaterNo: parseInt(roomForm.p_SeaterNo),
            p_RoomRent: parseFloat(roomForm.p_RoomRent),
            p_BedType: roomForm.p_BedType,
            p_WashroomType: roomForm.p_WashroomType,
            p_CupboardType: roomForm.p_CupboardType,
            p_isVentilated: roomForm.p_isVentilated,
            p_isCarpet: roomForm.p_isCarpet,
            p_isMiniFridge: roomForm.p_isMiniFridge
        };

        console.log("Submitting room data:", payload); // Debug log
        console.log("Is editing?", isEditing);

        try {
            const url = isEditing 
                ? "http://127.0.0.1:8000/faststay_app/Rooms/update/"
                : "http://127.0.0.1:8000/faststay_app/Rooms/add/";
            
            const method = isEditing ? "PUT" : "POST";
            
            console.log("Making", method, "request to:", url);
            
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("API Response:", data); // Debug log

            if (res.ok) {
                setMessage(data.message || (isEditing ? "Room updated successfully!" : "Room added successfully!"));
                
                // Refresh rooms list
                fetchRoomsForHostel(selectedHostelId);
                
                // Close modal after success
                setTimeout(() => {
                    closeModal();
                }, 1500);
            } else {
                setMessage(data.error || data.message || `Failed to ${isEditing ? 'update' : 'add'} room`);
            }
        } catch (error) {
            console.error("Error saving room:", error);
            setMessage("Server error occurred. Please check console for details.");
        }
    }

    async function deleteRoom(roomNo: number) {
        if (!window.confirm("Are you sure you want to delete this room?")) return;

        try {
            const res = await fetch("http://127.0.0.1:8000/faststay_app/Rooms/delete/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    p_HostelId: selectedHostelId,
                    p_RoomNo: roomNo
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || "Room deleted successfully!");
                // Refresh rooms list
                fetchRoomsForHostel(selectedHostelId!);
            } else {
                setMessage(data.error || "Failed to delete room");
            }
        } catch (error) {
            console.error("Error deleting room:", error);
            setMessage("Server error occurred");
        }
    }

    // Get selected hostel name
    const selectedHostel = hostels.find(h => h.p_HostelId === selectedHostelId);

    return (
        <>
            {/* NAVBAR */}
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <i className="fa-solid fa-building-user"></i> FastStay
                </div>
                <div className={styles.navLinks}>
                    <Link to={`/manager/dashboard?user_id=${managerId}`}>Dashboard</Link>
                    <Link to={`/manager/add_hostel?user_id=${managerId}`}>Add Hostel</Link>
                    <Link to={`/manager/add_room?user_id=${managerId}`} className={styles.active}>Add Room</Link>
                    <Link to={`/manager/profile?user_id=${managerId}`}>Your Profile</Link>
                    <Link to="/logout">Logout</Link>
                </div>
            </nav>

            <div className={styles.container}>
                <h2 className={styles.pageTitle}><i className="fa-solid fa-door-open"></i> Add Room</h2>
                <p className={styles.subtitle}>Select a hostel and manage its rooms</p>

                {/* Hostel Selector Card */}
                <div className={styles.card}>
                    <h3>Select Hostel</h3>
                    <div className={styles.hostelSelector}>
                        <div className={styles.inputGroup} style={{ flex: 1 }}>
                            <select 
                                id="hostel-select" 
                                value={selectedHostelId || ""}
                                onChange={handleHostelSelect}
                            >
                                <option value="" disabled>Select a hostel</option>
                                {hostels.map(hostel => (
                                    <option key={hostel.p_HostelId} value={hostel.p_HostelId}>
                                        {hostel.p_name} - {hostel.p_BlockNo}, {hostel.p_HouseNo} ({hostel.p_HostelType})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button 
                            className={styles.btn} 
                            id="add-room-btn" 
                            onClick={openAddModal}
                            disabled={!selectedHostelId}
                        >
                            <i className="fa-solid fa-plus"></i> Add New Room
                        </button>
                    </div>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`${styles.message} ${
                        message.includes("successfully") || 
                        message.includes("added") || 
                        message.includes("updated") ||
                        message.includes("deleted") 
                            ? styles.success 
                            : styles.error
                    }`}>
                        {message}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className={styles.loading}>
                        <i className="fa-solid fa-spinner fa-spin"></i> Loading rooms...
                    </div>
                )}

                {/* Existing Rooms */}
                {selectedHostelId && rooms.length > 0 && !loading && (
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>Existing Rooms - {selectedHostel?.p_name}</h3>
                            <div className={styles.hostelInfo}>
                                <span>Block: {selectedHostel?.p_BlockNo}</span>
                                <span>House: {selectedHostel?.p_HouseNo}</span>
                                <span>Type: {selectedHostel?.p_HostelType}</span>
                            </div>
                        </div>
                        
                        <div className={styles.roomsGrid}>
                            {rooms.map((room, index) => (
                                <div key={index} className={styles.roomCard}>
                                    <div className={styles.roomHeader}>
                                        <div className={styles.roomNumber}>Room {room.p_RoomNo}</div>
                                    </div>
                                    <div className={styles.roomDetails}>
                                        <div><i className="fa-solid fa-layer-group"></i> Floor {room.p_FloorNo}</div>
                                        <div><i className="fa-solid fa-users"></i> {room.p_SeaterNo} Seater</div>
                                        <div><i className="fa-solid fa-money-bill-wave"></i> Rent: ₹{room.p_RoomRent}</div>
                                        <div><i className="fa-solid fa-bed"></i> {room.p_BedType || "Not specified"}</div>
                                        <div><i className="fa-solid fa-toilet"></i> {room.p_WashroomType === "RoomAttached" ? "Attached" : "Community"}</div>
                                        <div><i className="fa-solid fa-archive"></i> {room.p_CupboardType === "PerPerson" ? "Per Person" : "Shared"}</div>
                                        {room.p_isVentilated && <div><i className="fa-solid fa-wind"></i> Ventilated</div>}
                                        {room.p_isCarpet && <div><i className="fa-solid fa-rug"></i> Carpet</div>}
                                        {room.p_isMiniFridge && <div><i className="fa-solid fa-snowflake"></i> Mini Fridge</div>}
                                    </div>
                                    <div className={styles.roomActions}>
                                        <button 
                                            className={`${styles.btn} ${styles.editBtn}`}
                                            onClick={() => openEditModal(room)}
                                        >
                                            <i className="fa-solid fa-edit"></i> Edit
                                        </button>
                                        <button 
                                            className={`${styles.btn} ${styles.deleteBtn}`}
                                            onClick={() => deleteRoom(room.p_RoomNo)}
                                        >
                                            <i className="fa-solid fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Rooms Message */}
                {selectedHostelId && rooms.length === 0 && !loading && (
                    <div className={`${styles.card} ${styles.noRooms}`}>
                        <i className="fa-solid fa-door-closed"></i>
                        <h3>No Rooms Added Yet</h3>
                        <p>Start by adding the first room to this hostel.</p>
                        <button className={styles.btn} onClick={openAddModal}>
                            <i className="fa-solid fa-plus"></i> Add First Room
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Room Modal */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {isEditing ? "Edit Room" : "Add New Room"}
                            </h3>
                            <button className={styles.closeModal} onClick={closeModal}>&times;</button>
                        </div>
                        
                        <form onSubmit={handleRoomSubmit} className={styles.roomForm}>
                            <input type="hidden" name="p_HostelId" value={selectedHostelId || ""} />
                            
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Room Number *</label>
                                    <input
                                        type="number"
                                        name="p_RoomNo"
                                        value={roomForm.p_RoomNo}
                                        onChange={handleRoomFormChange}
                                        placeholder="101"
                                        required
                                        disabled={isEditing}
                                        min="1"
                                    />
                                </div>
                                
                                <div className={styles.inputGroup}>
                                    <label>Floor Number *</label>
                                    <input
                                        type="number"
                                        name="p_FloorNo"
                                        value={roomForm.p_FloorNo}
                                        onChange={handleRoomFormChange}
                                        placeholder="1"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Seater Number *</label>
                                    <select
                                        name="p_SeaterNo"
                                        value={roomForm.p_SeaterNo}
                                        onChange={handleRoomFormChange}
                                        required
                                    >
                                        <option value="">Select Seater</option>
                                        <option value="1">1 Seater</option>
                                        <option value="2">2 Seater</option>
                                        <option value="3">3 Seater</option>
                                        <option value="4">4 Seater</option>
                                    </select>
                                </div>
                                
                                <div className={styles.inputGroup}>
                                    <label>Bed Type *</label>
                                    <select
                                        name="p_BedType"
                                        value={roomForm.p_BedType}
                                        onChange={handleRoomFormChange}
                                        required
                                    >
                                        <option value="">Select Bed Type</option>
                                        <option value="Bed">Bed</option>
                                        <option value="Mattress">Mattress</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Washroom Type *</label>
                                    <select
                                        name="p_WashroomType"
                                        value={roomForm.p_WashroomType}
                                        onChange={handleRoomFormChange}
                                        required
                                    >
                                        <option value="">Select Washroom Type</option>
                                        <option value="RoomAttached">Room Attached</option>
                                        <option value="Community">Community</option>
                                    </select>
                                </div>
                                
                                <div className={styles.inputGroup}>
                                    <label>Cupboard Type *</label>
                                    <select
                                        name="p_CupboardType"
                                        value={roomForm.p_CupboardType}
                                        onChange={handleRoomFormChange}
                                        required
                                    >
                                        <option value="">Select Cupboard Type</option>
                                        <option value="PerPerson">Per Person</option>
                                        <option value="Shared">Shared</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className={styles.row}>
                                <div className={styles.inputGroup}>
                                    <label>Room Rent (₹) *</label>
                                    <input
                                        type="number"
                                        name="p_RoomRent"
                                        value={roomForm.p_RoomRent}
                                        onChange={handleRoomFormChange}
                                        placeholder="5000"
                                        min="0"
                                        step="100"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.checkboxRow}>
                                <div className={styles.checkboxGroup}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="p_isVentilated"
                                            checked={roomForm.p_isVentilated}
                                            onChange={handleRoomFormChange}
                                        />
                                        Ventilated Room
                                    </label>
                                </div>
                                
                                <div className={styles.checkboxGroup}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="p_isCarpet"
                                            checked={roomForm.p_isCarpet}
                                            onChange={handleRoomFormChange}
                                        />
                                        Carpet Available
                                    </label>
                                </div>
                                
                                <div className={styles.checkboxGroup}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="p_isMiniFridge"
                                            checked={roomForm.p_isMiniFridge}
                                            onChange={handleRoomFormChange}
                                        />
                                        Mini Fridge Available
                                    </label>
                                </div>
                            </div>
                            
                            <button type="submit" className={`${styles.btn} ${styles.fullWidth}`}>
                                {isEditing ? "Update Room" : "Add Room"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}